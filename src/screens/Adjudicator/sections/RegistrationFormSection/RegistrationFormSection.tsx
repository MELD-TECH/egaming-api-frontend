import React, {useEffect, useState} from "react";
import {
    BuildingIcon,
    HashIcon,
    MailIcon,
    MapPinIcon,
    Plus,
    UserIcon,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { Button } from "../../../../components/ui/button.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Label } from "../../../../components/ui/label.tsx";
import { useToast } from "../../../../components/feedback/Toast.tsx";
import {
    addOperator,
    CompanyRequest, getLGAs,
    OperatorVerificationRequest,
    verifyBusinessRegistration
} from "../../../../lib/api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../../components/ui/select.tsx";
import {Lga} from "../../../../lib/appModels.ts";
import {LoadingButton} from "../../../../components/feedback/LoadingButton.tsx";
import {useNavigate} from "react-router-dom";
import {getUserContact} from "../../../../lib/checkPrivilege.ts";

export const RegistrationFormSection = (): JSX.Element => {
    const { show } = useToast();

    const [brn, setBrn] = React.useState("");
    const [companyName, setCompanyName] = React.useState("");
    const [companyEmail, setCompanyEmail] = React.useState("");
    const [companyPhone, setCompanyPhone] = React.useState("");
    const [companyAddress, setCompanyAddress] = React.useState("");
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [isVerified, setIsVerified] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    // LGA dropdown state
    const [lgas, setLgas] = useState<Lga[]>([]);
    const [selectedLgaId, setSelectedLgaId] = React.useState<string>("");
    const [lgasLoading, setLgasLoading] = React.useState<boolean>(false);
    const [lgasError, setLgasError] = React.useState<string>("");
    const navigate = useNavigate();


    const onVerifyClick = async () => {
        let regNum: string = brn.trim();
        if (!brn.trim()) {
            show({ title: "Missing BRN", message: "Please enter your registration number first.", type: "error" });
            return;
        }
        if(/^(rc|Rc|rC|RC)/.test(brn)) {
            regNum = brn.replace(/^(rc|Rc|rC|RC)/, "RC");
        }else if(/^(bn|Bn|bN|BN)/.test(brn)) {
            regNum = brn.replace(/^(bn|Bn|bN|BN)/, "BN");
        }
        try {
            const body: OperatorVerificationRequest = { firstname: '', lastname: '', phone_no: '', regNumber: regNum }
            setIsVerifying(true);
            const resp = await verifyBusinessRegistration(body, 'CAC');
            const verification = resp?.data;
            if (verification?.data) {
                setCompanyName(verification?.data?.name);
                setCompanyEmail(verification?.data?.contact);
                setCompanyAddress(verification?.data?.address);
                setIsVerified(true);
                show({ title: "Verification successful", message: "Registration number verified successfully.", type: "success" });
            }
        } catch (e: any) {
            setIsVerified(false);
            show({ title: "Verification failed", message: e?.message ?? "Could not verify registration number.", type: "error" });
        } finally {
            setIsVerifying(false);
        }
    };

    const otherDisabled = !isVerified; // all other fields disabled until verified

    const onSubmit = async () => {
        setSubmitting(true);
        if(selectedLgaId.trim() === "") {
            show({ title: "Missing LGA", message: "Please select your LGA first.", type: "error" });
            setSubmitting(false);
            return;
        }
        // The logic here is to check if the user has filled in all the required fields.
        const { fullName, email, phone, userId } = getUserContact();
        const body: CompanyRequest = {
            registrationNumber: brn,
            name: companyName,
            email: companyEmail,
            phone: companyPhone,
            address: companyAddress,
            lga: selectedLgaId,
            contactPerson: fullName,
            contactPersonPhone: phone,
            contactPersonEmail: email,
            userId
        }
        try {
            const resp = await addOperator(body);
            const operator = resp?.data;
            if (operator?.data) {
                show({title: "Registration successful", message: "Operator registered successfully.", type: "success"});
                navigate("/operator/setup", { replace: true, state: { operator: operator?.data?.publicId } });
            }
        }catch (e: any) {
            show({ type: "error", title: "Complete Operator setup Failed", message: e?.message || "Network error" });
        }finally {
            setSubmitting(false);
        }
    }

    // Load LGAs (after verification, so the field stays disabled until then)
    useEffect(() => {
          if (!isVerified) return;
          let mounted = true;
          (async () => {
                try {
                      setLgasLoading(true);
                      setLgasError("");
                      const resp = await getLGAs(20);
                      const lgaResp = resp?.data;
                      if (mounted) {
                          const list
                              = Array.isArray(lgaResp?.data?.data) ? lgaResp?.data?.data : [];
                          // @ts-ignore
                          setLgas(list);
                      }
                    } catch (e: any) {
                      if (mounted) setLgasError(e?.message || "Failed to load LGAs");
                    } finally {
                      if (mounted) setLgasLoading(false);
                    }
              })();
          return () => { mounted = false; };
        }, [isVerified]);

    return (
        <div className="flex flex-col w-full items-start gap-4 md:gap-6 relative">
            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                    <p className="relative self-stretch font-paragraph-lg font-[number:var(--paragraph-lg-font-weight)] text-slate-600 text-sm md:text-[length:var(--paragraph-lg-font-size)] text-center tracking-[var(--paragraph-lg-letter-spacing)] leading-[var(--paragraph-lg-line-height)] [font-style:var(--paragraph-lg-font-style)]">
                        Fill in your Company Details
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto] mt-0">
                <form className="flex flex-col items-start justify-end gap-3 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
                    {/* Business Registration Number */}
                    <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                            <Label
                                htmlFor="businessRegistration"
                                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                            >
                                Business Registration Number
                            </Label>

                            <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center gap-2 relative flex-1 grow">
                                    <HashIcon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                                    <Input
                                        id={"businessRegistration"}
                                        type={"text"}
                                        placeholder={"Enter Registration Number"}
                                        value={brn}
                                        onChange={(e) => setBrn(e.target.value)}
                                        disabled={isVerified}
                                        className="relative flex-1 border-0 bg-transparent p-0 font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>

                                {/* Verify button / status */}
                                <div className="flex items-center">
                                    {isVerified ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full text-xs md:text-sm">
                      <CheckCircle2 className="h-4 w-4" /> Verified
                    </span>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            // disabled={isVerifying || !brn.trim()}
                                            onClick={onVerifyClick}
                                            className="rounded-full h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm border border-slate-300 bg-white hover:bg-slate-50"
                                        >
                                            {isVerifying ? (
                                                <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                        </span>
                                            ) : (
                                                "Verify"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company name Field */}
                    <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                            <Label
                                htmlFor="companyName"
                                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                            >
                                Company Name
                            </Label>

                            <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center gap-2 relative flex-1 grow">
                                    <UserIcon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                                    <Input
                                        id={"companyName"}
                                        type={"text"}
                                        value={companyName}
                                        placeholder={"Enter Company Name"}
                                        disabled={otherDisabled}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="relative flex-1 border-0 bg-transparent p-0 font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Email */}
                    <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                            <Label
                                htmlFor="companyEmail"
                                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                            >
                                Company Email
                            </Label>

                            <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center gap-2 relative flex-1 grow">
                                    <MailIcon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                                    <Input
                                        id={"companyEmail"}
                                        type={"email"}
                                        value={companyEmail}
                                        placeholder={"Enter Company Email"}
                                        disabled={otherDisabled}
                                        onChange={(e) => setCompanyEmail(e.target.value)}
                                        className="relative flex-1 border-0 bg-transparent p-0 font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Phone */}
                    <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                            <Label
                                htmlFor="companyPhone"
                                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                            >
                                Company Phone
                            </Label>

                            <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center gap-2 relative flex-1 grow">
                                    <BuildingIcon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                                    <Input
                                        id={"companyPhone"}
                                        type={"text"}
                                        value={companyPhone}
                                        placeholder={"Enter Company Phone"}
                                        disabled={otherDisabled}
                                        onChange={(e) => setCompanyPhone(e.target.value)}
                                        className="relative flex-1 border-0 bg-transparent p-0 font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Address */}
                    <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                        <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                            <Label
                                htmlFor="companyAddress"
                                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                            >
                                Company Address
                            </Label>

                            <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center gap-2 relative flex-1 grow">
                                    <MapPinIcon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                                    <Input
                                        id={"companyAddress"}
                                        type={"text"}
                                        value={companyAddress}
                                        placeholder={"Enter Company Address"}
                                        disabled={otherDisabled}
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        className="relative flex-1 border-0 bg-transparent p-0 font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company LGA Dropdown */}
                        <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
                              <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                                <Label
                                  htmlFor="companyLga"
                                  className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                                >
                                  Local Government Area
                                </Label>
                                <div className="items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] border border-solid border-slate-300 flex relative self-stretch w-full">
                                  <Select
                                    disabled={otherDisabled || lgasLoading}
                                    value={selectedLgaId}
                                    onValueChange={(val) => setSelectedLgaId(val)}
                                  >
                                    <SelectTrigger className="min-h-10 md:min-h-12 h-auto rounded-full">
                                      <SelectValue placeholder={lgasLoading ? "Loading LGAs..." : lgasError ? "Failed to load LGAs" : "Select LGA"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {lgas.map((lga) => (
                                        <SelectItem key={lga.slugCode} value={lga.name}>
                                              {lga.name}
                                            </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {lgasError ? (
                                  <p className="text-xs text-red-600">{lgasError}</p>
                                ) : null}
                              </div>
                    </div>
                </form>

                <div className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
                    <LoadingButton
                        type="button"
                        onClick={onSubmit}
                        loading={submitting}
                        className="flex min-h-10 md:min-h-12 items-center justify-center gap-2 md:gap-2.5 px-4 md:px-5 py-2 md:py-3 relative self-stretch w-full flex-[0_0_auto] bg-primary-500 rounded-[1234px] overflow-hidden h-auto hover:bg-primary-500/90 disabled:opacity-60"
                        disabled={!isVerified}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Complete Setup
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
};