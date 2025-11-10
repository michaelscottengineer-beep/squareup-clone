import type { TDiscount } from "@/types/discount";
import type { TCartItem, TItem } from "@/types/item";

export const parseSegments = (...segments: any[]): string => {
  const cleaned = segments.map((s) => {
    const seg = String(s ?? "");
    return seg.replace(/^\/+|\/+$/g, "");
  });

  return cleaned.join("/");
};

export function convertFirebaseArrayData<T>(data: { [id: string]: T }) {
  return (Object.entries(data).map(([id, val]) => ({ ...val, id })) ??
    []) as T[];
}

export const calcItemPrice = (
  price: number,
  quantity: number,
  discount?: TDiscount
) => {
  if (!discount) return 0;

  let total = quantity * price;
  if (discount.unit === "%") total = total - (total * discount.value) / 100;
  else total = total - discount.value;

  return total;
};

export const calcPromotion = (
  price: number,
  quantity: number,
  promotion: number
) => {
  const total = quantity * price;
  return (total * promotion) / 100;
};

import type { TPromotion } from "@/types/promotion";
import { useMemo } from "react";

export function getAvailablePromotions(promotions: TPromotion[]) {
  const ret =
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
      const isTimeInRange = currentTime >= timeFrom && currentTime <= timeTo;

      // Combined check
      const isCurrentlyActive = isDateInRange && isTimeInRange;
      return !item.basicInfo.isDeleted && isCurrentlyActive;
    }) ?? [];
  return ret;
}

export function getConcatAddress(
  street: string,
  city: string,
  state: string,
  zip: string
) {
  return [street, city, state + " " + zip].join(", ");
}
