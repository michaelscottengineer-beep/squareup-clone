import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface SettingWrapper extends PropsWithChildren {
  label?: string;
  className?: string;
}

const SettingWrapper = ({ label, className, children }: SettingWrapper) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-[#333]">{label}</Label>}
      <div className="space-y-3">{children}</div>
    </div>
  );
};

export default SettingWrapper;
