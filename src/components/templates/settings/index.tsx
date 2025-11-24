import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface SettingSection extends PropsWithChildren {
  label?: string;
  className?: string;
}

const SettingSection = ({ label, className, children }: SettingSection) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-lg text-gray-500">{label}</Label>}
      <div className="space-y-3">{children}</div>
    </div>
  );
};

export default SettingSection;
