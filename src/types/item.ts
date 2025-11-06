import type { TCategory } from "./category";
import type { TModifier } from "./modifier";

export type TItem = {
  name: string;
  price: string;
  id: string;
  selected?: boolean;
  type: string;
  categories: TCategory[],
  description: string;
  image: string,
  modifiers: TModifier[]
}


export type TCartItem = TItem & {
  amount: number;
  note: string;
}
export type TItemForm = Omit<TItem, 'id'>