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
  image: '',
  modifiers: TModifier[]
}

export type TItemForm = Omit<TItem, 'id'>