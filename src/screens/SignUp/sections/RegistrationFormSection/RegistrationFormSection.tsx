import {
  BuildingIcon,
  HashIcon,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Label } from "../../../../components/ui/label.tsx";

const formFields = [
  {
    id: "businessRegistration",
    label: "Business Registration Number",
    placeholder: "Enter Registration Number",
    icon: HashIcon,
    type: "text",
  },
  {
    id: "companyName",
    label: "Company Name",
    placeholder: "Enter Company Name",
    icon: BuildingIcon,
    type: "text",
  },
];



export const RegistrationFormSection = (): JSX.Element => {

  // const navigate = useNavigate();

  // const handleSignInClick = () => {
  //   navigate('/login');
  // };

  return (
    <div className="flex flex-col w-full items-start gap-4 md:gap-6 relative">
      <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
        {/*<div className="relative w-[42.38px] h-[49px] bg-[url(/vector.png)] bg-[100%_100%]" />*/}

        <div className="flex flex-col items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative self-stretch font-paragraph-lg font-[number:var(--paragraph-lg-font-weight)] text-slate-600 text-sm md:text-[length:var(--paragraph-lg-font-size)] text-center tracking-[var(--paragraph-lg-letter-spacing)] leading-[var(--paragraph-lg-line-height)] [font-style:var(--paragraph-lg-font-style)]">
            Fill in your Company and Personal Details
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
        <form className="flex flex-col items-start justify-end gap-3 md:gap-4 relative self-stretch w-full flex-[0_0_auto]">
          {formFields.map((field) => (
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
                    <field.icon className="relative w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" />
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="relative flex-1 border-0 bg-transparent p-0 [font-family:'Inter',Helvetica] font-medium text-slate-600 text-sm md:text-base tracking-[-0.11px] leading-[22px] placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

        </form>

        <div className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
          <Button
            type="submit"
            className="flex min-h-10 md:min-h-12 items-center justify-center gap-2 md:gap-2.5 px-4 md:px-5 py-2 md:py-3 relative self-stretch w-full flex-[0_0_auto] bg-primary-500 rounded-[1234px] overflow-hidden h-auto hover:bg-primary-500/90"
          >
            <span className="relative w-fit [font-family:'Inter',Helvetica] font-bold text-white text-sm md:text-base tracking-[-0.11px] leading-[22px] whitespace-nowrap">
              Complete Setup
            </span>

            <img
              className="relative w-4 h-4 md:w-5 md:h-5"
              alt="Sign out"
              src="/signout.svg"
            />
          </Button>

        </div>
      </div>
    </div>
  );
};
