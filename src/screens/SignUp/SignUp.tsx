import React from "react";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { RegistrationFormSection } from "./sections/RegistrationFormSection/RegistrationFormSection";

export const SignUp = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full relative">
      <div className="flex-1 flex justify-center items-start pt-8 md:pt-[11vh] px-4 md:px-8">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <RegistrationFormSection />
        </div>
      </div>
      <div className="w-full">
        <MainContentSection />
      </div>
    </div>
  );
};
