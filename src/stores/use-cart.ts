import type { TCartItem } from "@/types/item";
import { useMemo } from "react";
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

const useCartTotal = () => {
  const items = useCart((state) => state.items);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const selectedModifier = item.modifiers?.[0]?.list?.[0];

      const total = Number(item.price) * item.amount;
      const totalWithModifiers =
        total +
        (selectedModifier ? Number(selectedModifier.price) * item.amount : 0);
      const totalWithPromotion =
        totalWithModifiers - (totalWithModifiers * 20) / 100;

      return acc + totalWithPromotion;
    }, 0);
  }, [items]);

  return total.toFixed(2);
};
export default useCart;
export { useCartTotal };
