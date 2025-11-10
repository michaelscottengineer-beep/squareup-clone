import { Card } from "@/components/ui/card";
import useAvailablePromotions from "@/hooks/use-available-promotions";
import { cn } from "@/lib/utils";
import type { TPromotion } from "@/types/promotion";
import type { Promotion } from "@/types/romotion";
import { formatDate } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import React from "react";

interface PromotionCardProps {
  item: TPromotion;
}

const PromotionCard = ({ item }: PromotionCardProps) => {
  const availablePromotion = useAvailablePromotions([item]);

  return (
    <div className="flex rounded-xl shadow-md">
      <div className="left rounded-tl-xl rounded-bl-xl items-center  justify-center font-semibold px-5 py-10 text-[#f5f5f5] flex flex-col bg-[#ffb663]">
        <span>Discount</span>
        <span className="text-2xl">{item.basicInfo.discount}%</span>
        <span>OFF</span>
      </div>
      <div className="right flex-1 px-5 py-3 space-y-2">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold">{item.basicInfo.title}</h2>
          <div
            className={cn(
              "bg-[#ffb663] text-sm text-[#f5f5f5] w-max h-max rounded-full px-2",
              {
                "bg-green-400 text-[#f5f5f5]": availablePromotion.length > 0,
              }
            )}
          >
            {availablePromotion.length > 0 ? "Active" : ""}
          </div>
        </div>
        <div className="space-y-1">
          <div className="items-center flex gap-2 text-sm">
            <Calendar className="h-4 w-4" />{" "}
            <span>
              {formatDate(new Date(item.basicInfo.schedule.date.from), "dd/MM/yyyy") +
                " - " +
                formatDate(new Date(item.basicInfo.schedule.date.to), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="items-center flex gap-2 text-sm">
            <Clock className="h-4 w-4" />{" "}
            <span>
              {item.basicInfo.schedule.time.from +
                " - " +
                item.basicInfo.schedule.time.to}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <h3>Applied to: </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.values(item.items ?? {}).map((item, i) => {
              return <AppliedToCard key={i + 1}>{item.name}</AppliedToCard>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppliedToCard = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-muted rounded-full w-max h-max text-sm px-2 py-1 capitalize">
      {children}
    </div>
  );
};

const PromotionStatusBadge = () => {};

export default PromotionCard;
