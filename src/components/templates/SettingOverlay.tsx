import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Edit, Trash2, X } from "lucide-react";
import type { CSSProperties } from "react";

interface SettingOverlayProps {
  settingContent?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}
const SettingOverlay = ({
  style,
  settingContent,
  className,
}: SettingOverlayProps) => {
  return (
    <div
      className={cn(
        "bg-black/30 w-full h-full absolute top-0 left-0 backdrop-blur-[1px] edit-overlay",
        className
      )}
      style={style}
    >
      <SettingSheet settingContent={settingContent} />
    </div>
  );
};

interface SettingSheetProps {
  settingContent?: React.ReactNode;
}
const SettingSheet = ({ settingContent }: SettingSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Button className="bg-white text-black hover:bg-white hover:text-black">
          <Edit /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="overflow-y-auto">
        {settingContent}
      </SheetContent>
    </Sheet>
  );
};

export default SettingOverlay;
