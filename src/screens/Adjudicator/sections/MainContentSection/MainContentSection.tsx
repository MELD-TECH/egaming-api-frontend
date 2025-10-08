import { Button } from "../../../../components/ui/button.tsx";

const footerLinks = [
  { text: "Privacy Policy", href: "#" },
  { text: "Terms & Conditions", href: "#" },
];

export const MainContentSection = (): JSX.Element => {
  return (
    <footer className="flex flex-col w-full items-start gap-2.5 px-4 md:px-16 py-3 md:py-4 bg-slate-50 border-t border-slate-300">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2 md:gap-0">
        <div className="[font-family:'Inter',Helvetica] font-bold text-slate-600 text-base tracking-[-0.11px] leading-[22px]">
          Copyright 2025 ESGC ©
        </div>

        <nav className="flex items-center gap-4 md:gap-8">
          {footerLinks.map((link, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 [font-family:'Inter',Helvetica] font-medium text-primary-500 text-sm md:text-base tracking-[-0.11px] leading-[22px] whitespace-nowrap"
            >
              {link.text}
            </Button>
          ))}
        </nav>
      </div>
    </footer>
  );
};
