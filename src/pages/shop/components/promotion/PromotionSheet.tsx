import React, { type ReactNode } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftIcon, Plus, X } from "lucide-react";
import PromotionCard from "./PromotionCard";
import type { TPromotion } from "@/types/promotion";

interface PromotionSheetProps {
  triggerButton?: ReactNode;
  promotions: TPromotion[];
}
const PromotionSheet = ({ promotions, triggerButton }: PromotionSheetProps) => {
  return (
    <Sheet>
      {triggerButton && <SheetTrigger asChild>{triggerButton}</SheetTrigger>}
      <SheetContent
        showCloseButton={false}
        className="w-[500px] max-w-[500px]!"
      >
        <SheetHeader className="flex cursor-pointer items-center flex-row border border-border">
          <SheetClose className="bg-muted p-1 rounded-md hover:shadow-sm  h-max w-max">
            <ArrowLeftIcon />
          </SheetClose>
          <SheetTitle className="text-center flex-1 text-xl font-semibold">
            Promotion
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 space-y-6">
          {promotions.map((item, i) => {
            return <PromotionCard key={"promotion" + i} item={item} />;
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PromotionSheet;
