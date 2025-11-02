import { create } from "zustand";
import type { TItem } from "../types/item";

type TItemsFormStore = {
  items: Pick<TItem, "name" | "price">[];
  clear: () => void;
  set: (items: Pick<TItem, "name" | "price">[]) => void;
};

const useItemsForm = create<TItemsFormStore>((set, get) => ({
  items: [],
  clear: () => set({ items: [] }),
  set: (items) => set({ items }),
}));

export default useItemsForm;
