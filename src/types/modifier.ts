import type { TDiscount } from "./discount";

export type TModifierListItem = {
  id: string;
  name: string;
  price: string;
  hideOnline?: boolean;
  preSelect?: boolean;
  inStock?: boolean;
  discount?: TDiscount
};

export type TModifier = {
  id: string;
  basicInfo: {
    name: string;
    displayName: string;
    locations?: string[];
    kind: "list" | "text";
  };
  list: TModifierListItem[];
};
