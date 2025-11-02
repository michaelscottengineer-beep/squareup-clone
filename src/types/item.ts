export type TItem = {
  name: string;
  price: string;
  id: string;
  selected?: boolean;
}

export type TItemForm = Omit<TItem, 'id'>