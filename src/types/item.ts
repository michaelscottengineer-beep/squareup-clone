import type { TCategory } from "./category";
import type { TDiscount } from "./discount";
import type { TModifier } from "./modifier";
import type { TPromotion } from "./promotion";

export type TItem = {
  name: string;
  price: string;
  id: string;
  selected?: boolean;
  type: string;
  categories: TCategory[],
  description: string;
  image: string;
  modifiers: TModifier[];
  promotions: TPromotion[]
  discount?: TDiscount
}


export type TCartItem = TItem & {
  amount: number;
  note: string;
}
export type TItemForm = Omit<TItem, 'id'>