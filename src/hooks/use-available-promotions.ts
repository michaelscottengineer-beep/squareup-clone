import type { TPromotion } from "@/types/promotion";
import { useMemo } from "react";

export default function useAvailablePromotions(
  promotions: TPromotion[],
  dependencies?: any[]
) {
  const ret = useMemo(
    () => {
      return (
        promotions?.filter((item) => {
          const date = item.basicInfo.schedule.date;
          const dateFrom = new Date(date.from);
          const dateTo = new Date(date.to);

          const time = item.basicInfo.schedule.time;
          const timeFrom = time.from;
          const timeTo = time.to;

          // Check if current date is within the date range
          const now = new Date();
          const isDateInRange = now >= dateFrom && now <= dateTo;

          // Check if time is in range (if needed)
          const currentTime =
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0");
          const isTimeInRange =
            currentTime >= timeFrom && currentTime <= timeTo;

          // Combined check
          const isCurrentlyActive = isDateInRange && isTimeInRange;
          return !item.basicInfo.isDeleted && isCurrentlyActive;
        }) ?? []
      );
    },
    dependencies ? [...dependencies] : []
  );
  return ret;
}
