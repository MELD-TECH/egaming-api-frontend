import {
  // BuildingIcon,
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  // HashIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import React, {ChangeEvent, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/ui/button.tsx";
import { Checkbox } from "../../../../../components/ui/checkbox.tsx";
import { Input } from "../../../../../components/ui/input.tsx";
import { Label } from "../../../../../components/ui/label.tsx";
import {CInput} from "../../../../../components/form/CInput.tsx";
import {password as passwordValidator} from "../../../../../components/form/validators.ts";
import {LoadingButton} from "../../../../../components/feedback/LoadingButton.tsx";
import {APP_ID, signUpUser} from "../../../../../lib/api.ts";
import {useToast} from "../../../../../components/feedback/Toast.tsx";

const nameFields = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "First Name",
    icon: UserIcon,
    type: "text",
  },
  {
    id: "lastName",
    label: "Last Name",
    placeholder: "Last Name",
    icon: UserIcon,
    type: "text",
  },
];

const contactFields = [
  {
    id: "email",
    label: "Email Address",
    placeholder: "example@gmail.com",
    icon: MailIcon,
    type: "email",
    required: `required`,
    pattern: `${"^\\S+@\\S+\\.\\S+$"}`,
    patternMessage: `Please enter a valid email address`,
    info: "We’ll never share your email.",
  },
];

const passwordFields = [
  {
    id: "password",
    label: "Create Password",
    placeholder: "*****************",
    icon: LockIcon,
    type: "password",
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    placeholder: "*****************",
    icon: LockIcon,
    type: "password",
  },
];

// @ts-ignore
export const RegistrationFormSection = (): JSX.Element => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phonenUmber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();

    // NEW: error state
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const validateNewPassword = (value: string) => {
        const err = passwordValidator(8)(value);

        setNewPasswordError(err);
        if (confirmPassword) {
            setConfirmPasswordError(value === confirmPassword ? null : "Passwords do not match");
        }
    };

    const validateConfirmPassword = (value: string, base: string) => {
        setConfirmPasswordError(value === base ? null : "Passwords do not match");
    };

    const doValidation = (e: ChangeEvent<HTMLInputElement>, type: number) => {
        // @ts-ignore
        const value = e.target.value;
        if (type === 0) {
            setNewPassword(value);
            validateNewPassword(value);
        } else {
            setConfirmPassword(value);
            validateConfirmPassword(value, newPassword);
        }
    }

  const handleSignInClick = () => {
    navigate('/');
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pwErr = passwordValidator(8)(newPassword);
        const confErr = newPassword === confirmPassword ? null : "Passwords do not match";

        setNewPasswordError(pwErr);
        setConfirmPasswordError(confErr);

        if (pwErr || confErr) return; // prevent submit


        setDisabled(!disabled);
        try {
            // @ts-ignore
            const resp = await signUpUser({
                email, username: email,
                firstName, lastName,
                password: newPassword,
                phone: phonenUmber,
                role: 'STANDARD',
                appId: APP_ID });
            const neUser = resp?.data;
            if (neUser?.data) {
                navigate('/', { replace: true });
            }
        }catch (e) {
            console.log(e);
            // @ts-ignore
            const errMsg = e?.details?.userMessage?.replace("01 - Username", "Email Address");
            show({ type: "error", title: "New Account Creation Failed", message: errMsg });
            setDisabled(false);
        }
    };


    return (
    <div className="flex flex-col w-full items-start gap-4 md:gap-6 relative">
      <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-[42.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />

        <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <h1 className="relative self-stretch mt-[-1.00px] font-heading-sm-extrabold font-[number:var(--heading-sm-extrabold-font-weight)] text-gray-80 text-xl md:text-[length:var(--heading-sm-extrabold-font-size)] text-center tracking-[var(--heading-sm-extrabold-letter-spacing)] leading-[var(--heading-sm-extrabold-line-height)] [font-style:var(--heading-sm-extrabold-font-style)]">
            Operator Registration
          </h1>

          <p className="relative self-stretch font-paragraph-lg font-[number:var(--paragraph-lg-font-weight)] text-slate-600 text-sm md:text-[length:var(--paragraph-lg-font-size)] text-center tracking-[var(--paragraph-lg-letter-spacing)] leading-[var(--paragraph-lg-line-height)] [font-style:var(--paragraph-lg-font-style)]">
            Fill in your Personal Details
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
        <form className="flex flex-col items-start justify-end gap-3 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col md:flex-row items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            {nameFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col items-end gap-2 relative w-full md:flex-1 md:grow"
              >
                <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <Label
                    htmlFor={field.id}
                    className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                  >
                    {field.label}
                  </Label>

                  <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-center gap-2 relative flex-1 grow">
                      <field.icon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        onChange={(e) => {index === 0 ? setFirstName(e.target.value) : setLastName(e.target.value)}}
                        className="relative flex-1 border-0 bg-transparent p-0 [font-family:'Inter',Helvetica] font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {contactFields.map((field) => (
            <div
              key={field.id}
              className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]"
            >
              <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <Label
                  htmlFor={field.id}
                  className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                >
                  {field.label}
                </Label>

                <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center gap-2 relative flex-1 grow">
                    <field.icon className="relative w-4 h-4 md:w-5 md:h-5 text-slate-600 flex-shrink-0" />
                    <CInput
                        id={field.id}
                        label={""}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        pattern={field.pattern}
                        patternMessage={field.patternMessage}
                        onChange={(e) => {setEmail(e.target.value)}}
                        className="relative flex-1 mt-[-1.00px] border-0 bg-transparent p-0 [font-family:'Inter',Helvetica] font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] focus-visible:ring-0 focus-visible:ring-offset-0"
                        name={"email"}                    />
                  </div>
                </div>
                  <span className={"text-blue-600"}>{field.info}</span>
              </div>
            </div>
          ))}

          <div className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <Label
                htmlFor="phone"
                className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
              >
                PhoneIcon Number
              </Label>

              <div className="flex min-h-10 md:min-h-12 items-center relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300">
                <div className="inline-flex items-center gap-1 md:gap-1.5 p-2 md:p-3 relative self-stretch flex-[0_0_auto] bg-gray-5 border-r [border-right-style:solid] border-slate-300">
                  <FlagIcon className="relative w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                  <img
                    className="relative w-4 h-4 md:w-5 md:h-5"
                    alt="Icon"
                    src="/icon-5.svg"
                  />
                </div>

                <div className="flex items-center gap-1 md:gap-1.5 p-2 md:p-3 relative flex-1 grow">
                  <div className="relative w-fit font-text-md-bold font-[number:var(--text-md-bold-font-weight)] text-slate-600 text-sm md:text-[length:var(--text-md-bold-font-size)] tracking-[var(--text-md-bold-letter-spacing)] leading-[var(--text-md-bold-line-height)] whitespace-nowrap [font-style:var(--text-md-bold-font-style)]">
                    +234
                  </div>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(000) 000-0000"
                    onChange={(e) => {setPhoneNumber(e.target.value)}}
                    className="relative flex-1 border-0 bg-transparent p-0 font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-60 text-sm md:text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {passwordFields.map((field, index) => (
            <div
              key={field.id}
              className="flex-col items-end gap-2 flex relative self-stretch w-full flex-[0_0_auto]"
            >
              <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <Label
                  htmlFor={field.id}
                  className="relative self-stretch mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] [font-style:var(--text-sm-bold-font-style)]"
                >
                  {field.label}
                </Label>

                <div className="min-h-10 md:min-h-12 items-center gap-2 md:gap-3 p-2 md:p-3 bg-white rounded-[123px] overflow-hidden border border-solid border-slate-300 flex relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center gap-2 relative flex-1 grow">
                    <field.icon className="relative w-4 h-4 md:w-5 md:h-5 text-slate-600 flex-shrink-0" />
                    <Input
                      id={field.id}
                      type={
                        index === 0
                          ? showPassword
                            ? "text"
                            : "password"
                          : showConfirmPassword
                            ? "text"
                            : "password"
                      }
                      placeholder={field.placeholder}
                      required
                      onChange={(e) =>  doValidation(e, index)}
                      className={`relative flex-1 mt-[-1.00px] border-0 bg-transparent p-0 [font-family:'Inter',Helvetica] font-medium text-sm md:text-base tracking-[-0.11px] leading-[22px] focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-600"}`}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() =>
                      index === 0
                        ? setShowPassword(!showPassword)
                        : setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {(index === 0 ? showPassword : showConfirmPassword) ? (
                      <EyeOffIcon className="relative w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                    ) : (
                      <EyeIcon className="relative w-4 h-4 md:w-5 md:h-5 text-slate-600" />
                    )}
                  </Button>
                </div>
              </div>
                {newPasswordError && (
                    <p id="newPassword-error" className="text-sm text-red-600 mt-1">{newPasswordError}</p>
                )}
                {confirmPasswordError && (
                    <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">{confirmPasswordError}</p>
                )}
            </div>
          ))}

            {/* Password Requirements */}
            <div className="bg-gray-5 rounded-lg p-4 justify-center items-center">
                <h4 className="text-sm font-bold text-gray-80 mb-3 tracking-tight">Password Requirements</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">At least 8 characters long</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains uppercase and lowercase letters</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains at least one number</span></div>
                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-40 rounded-full"></div><span className="text-sm text-gray-60 tracking-tight">Contains at least one special character</span></div>
                </div>
            </div>

          <div className="flex items-end gap-4 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center gap-2 relative flex-1 grow">
              <Checkbox
                id="terms"
                checked={isAgreed}
                  // @ts-ignore
                onCheckedChange={setIsAgreed}
                className="relative w-4 h-4 bg-primary-500 rounded-md border-0 data-[state=checked]:bg-primary-500 data-[state=checked]:text-white"
              />

              <Label
                htmlFor="terms"
                className="relative w-fit mt-[-1.00px] font-text-sm-semibold font-[number:var(--text-sm-semibold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-semibold-font-size)] tracking-[var(--text-sm-semibold-letter-spacing)] leading-[var(--text-sm-semibold-line-height)] [font-style:var(--text-sm-semibold-font-style)] cursor-pointer"
              >
                <span className="text-slate-800 tracking-[var(--text-sm-semibold-letter-spacing)] font-text-sm-semibold [font-style:var(--text-sm-semibold-font-style)] font-[number:var(--text-sm-semibold-font-weight)] leading-[var(--text-sm-semibold-line-height)] text-xs md:text-[length:var(--text-sm-semibold-font-size)]">
                  I agree to the{" "}
                </span>

                <span className="text-[#056232] tracking-[var(--text-sm-semibold-letter-spacing)] font-text-sm-semibold [font-style:var(--text-sm-semibold-font-style)] font-[number:var(--text-sm-semibold-font-weight)] leading-[var(--text-sm-semibold-line-height)] text-xs md:text-[length:var(--text-sm-semibold-font-size)]">
                  Terms and Conditions
                </span>
              </Label>
            </div>
          </div>
        </form>

        <div className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
            {/* Change Password Button */}
            <LoadingButton type="submit"
                           loading={disabled}
                           disabled={!isAgreed}
                           onClick={handleSubmit}
                           className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full tracking-tight transition-all duration-200 shadow-lg hover:shadow-xl">
                <span className="relative w-fit [font-family:'Inter',Helvetica] font-bold text-white text-sm md:text-base tracking-[-0.11px] leading-[22px] whitespace-nowrap">
                  Sign Up
                </span>

                    <img
                        className="relative w-4 h-4 md:w-5 md:h-5"
                        alt="Sign out"
                        src="/signout.svg"
                    />
            </LoadingButton>

          <div className="flex items-center justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
            <span className="relative w-fit mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-gray-80 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] whitespace-nowrap [font-style:var(--text-sm-bold-font-style)]">
              Already have an account?
            </span>

            <Button
              variant="link"
              className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] p-0 h-auto"
              onClick={handleSignInClick}
            >
              <span className="relative w-fit mt-[-1.00px] font-text-sm-bold font-[number:var(--text-sm-bold-font-weight)] text-primary-500 text-xs md:text-[length:var(--text-sm-bold-font-size)] tracking-[var(--text-sm-bold-letter-spacing)] leading-[var(--text-sm-bold-line-height)] whitespace-nowrap [font-style:var(--text-sm-bold-font-style)]">
                Sign In
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
