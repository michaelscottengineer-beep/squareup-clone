import type { TDiscount } from "@/types/discount";
import type { TCartItem, TItem } from "@/types/item";

export const parseSegments = (...segments: any[]) => {
  const cleaned = segments.map((s) => {
    // String(...) handles numbers, null, undefined, objects (calls toString)
    const seg = String(s ?? "");
    // remove leading OR trailing slashes (any number of them)
    return seg.replace(/^\/+|\/+$/g, "");
  });

  console.log(cleaned);
  return cleaned.join("/");
};

export function convertFirebaseArrayData<T>(data: { [id: string]: T }) {
  return (Object.entries(data).map(([id, val]) => ({ ...val, id })) ?? []) as T[];
}


export const calcItemPrice = (price: number, quantity: number, discount?: TDiscount) => {
  if (!discount) return 0;

  let total = quantity * price;
  if (discount.unit === "%") total = total - (total * discount.value) / 100;
  else total = total - discount.value;

  return total;
}