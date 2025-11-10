import type { TCartItem } from "@/types/item";
import { calcPromotion, getAvailablePromotions } from "@/utils/helper";
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
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useCartTotal = () => {
  const items = useCart((state) => state.items);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const availablePromotions = getAvailablePromotions(item.promotions);
      const totalPromotion = availablePromotions.reduce((acc, pro) => {
        return acc + pro.basicInfo.discount;
      }, 0);

      const selectedModifier = item.modifiers?.[0]?.list?.[0];

      const total = Number(item.price) * item.amount;
      const totalPriceWithDiscount =
        total -
        Number(
          item.discount?.unit === "%"
            ? (total * item.discount?.value) / 100
            : item.discount?.value
        );

      const totalPriceWithPromotion =
        totalPriceWithDiscount -
        calcPromotion(Number(item.price), item.amount, totalPromotion);

      const totalWithModifiers =
        totalPriceWithPromotion +
        (selectedModifier ? Number(selectedModifier.price) * item.amount : 0);

      const finalTotal = totalWithModifiers;

      return acc + finalTotal;
    }, 0);
  }, [items]);

  return Number(total.toFixed(2));
};
export default useCart;
export { useCartTotal };
