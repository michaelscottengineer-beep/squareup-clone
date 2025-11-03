import type { TCategory } from "./category";

export type TItem = {
  name: string;
  price: string;
  id: string;
  selected?: boolean;
  type: string;
  categories: TCategory[],
  description: string;
  image: '',

}

export type TItemForm = Omit<TItem, 'id'>