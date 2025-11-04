import type { TCartItem } from "@/types/item";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TCartStore = {
  items: TCartItem[];
  clear: () => void;
  set: (items: TCartItem[]) => void;
  add: (item: TCartItem) => void;
  remove: (item: TCartItem) => void;
};

const useCart = create<TCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      clear: () => set({ items: [] }),
      set: (items) => set({ items }),
      add: (item) => set({ items: [...get().items, item] }),
      remove: (item) =>
        set({ items: get().items.filter((cur) => cur.id !== item.id) }),
    }),
    {
      name: "cart-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useCart;
