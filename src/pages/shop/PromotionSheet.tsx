import React, { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RiShoppingCartLine } from "react-icons/ri";
import useCart from "@/stores/use-cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftFromLine, ArrowLeftIcon, Plus, X } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { TCartItem } from "@/types/item";
import PromotionCard from "./PromotionCard";
import type { Promotion } from "@/types/romotion";
import { RiDiscountPercentLine } from "react-icons/ri";

const promotions: Promotion[] = [
  {
    title: "Custom Promotion",
    discount: 10,
    status: "Active",
    schedule: {
      repeat: "Every day",
      time: "All Day",
      dates: [],
    },
    appliedTo: {
      type: "All",
    },
  },
  {
    title: "Christmas Day",
    discount: 2,
    status: "Upcoming",
    schedule: {
      dates: ["12-25-2025", "12-26-2025"],
      time: "09:00 - 00:00",
    },
    appliedTo: {
      type: "Items",
      items: ["Chicken Sandwich", "Pull Pork Sandwich", "Steak Sandwich"],
    },
  },
  {
    title: "Custom Promotion 1",
    discount: 5,
    status: "Upcoming",
    schedule: {
      dates: ["11-18-2025", "11-19-2025", "11-25-2025", "11-26-2025"],
      time: "15:30 - 19:00",
    },
    appliedTo: {
      type: "Items",
      items: ["Chicken Sandwich", "Coca-Cola"],
    },
  },
];

interface PromotionSheetProps {
  triggerButton?: ReactNode;
}
const PromotionSheet = ({ triggerButton }: PromotionSheetProps) => {
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
