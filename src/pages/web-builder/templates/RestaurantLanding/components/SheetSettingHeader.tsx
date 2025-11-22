import { Button } from "@/components/ui/button";
import { SheetClose, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

interface SheetSettingHeader {
  title: string;
}
const SheetSettingHeader = ({ title }: SheetSettingHeader) => {
  return (
    <div className="flex justify-between items-center border-b border-border px-4 py-2">
      <SheetTitle>{title}</SheetTitle>
      <SheetClose asChild>
        <Button variant={"ghost"} className="rounded-full">
          <X />
        </Button>
      </SheetClose>
    </div>
  );
};

export default SheetSettingHeader;