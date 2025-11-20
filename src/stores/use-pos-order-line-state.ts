import type { TCartItem } from "@/types/item";
import { calcPromotion, getAvailablePromotions } from "@/utils/helper";
import { useMemo } from "react";
import { create } from "zustand";

export type TSelectedItem = { [key: string]: TCartItem };
type TCartStore = {
  currentCategoryId: string;
  selectedItems: TSelectedItem;
  tableNo: string;
  orderId?: string;
  paymentMethod: string;
  clear: () => void;
  add: (item: TCartItem) => void;
  remove: (item: TCartItem) => void;

  setTableNo: (no: string) => void;
  setPaymentMethod: (no: string) => void;
  setOrderId: (orderId: string) => void;
  setCurrentCategoryId: (id: string) => void;
  setSelectedItems: (items: TSelectedItem) => void;
};

const usePosOrderLineState = create<TCartStore>((set, get) => ({
  currentCategoryId: "",
  orderId: undefined,
  tableNo: "",
  selectedItems: {},
  paymentMethod: "cash",
  clear: () =>
    set({
      selectedItems: {},
      tableNo: "",
      orderId: undefined,
    }),
  add: (item) => {
    const prevItem = get().selectedItems[item.id] || item;

    return set({
      selectedItems: {
        ...get().selectedItems,
        [item.id]: { ...prevItem, amount: (prevItem?.amount || 0) + 1 },
      },
    });
  },
  remove: (item) => {
    const selectedItems = { ...get().selectedItems };
    const prevItem = selectedItems[item.id];
    if (prevItem.amount - 1 === 0) {
      delete selectedItems[item.id];
      return set({ selectedItems });
    }

    return set({
      selectedItems: {
        ...selectedItems,
        [item.id]: { ...prevItem, amount: prevItem.amount - 1 },
      },
    });
  },
  setSelectedItems: (items) => set({ selectedItems: items }),
  setOrderId: (id) => set({ orderId: id }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setTableNo: (no) => set({ tableNo: no }),
  setCurrentCategoryId: (id) => set({ currentCategoryId: id }),
}));

const usePosOrderLineSubtotal = () => {
  const items = usePosOrderLineState((state) => state.selectedItems);
  console.log(items);
  const total = useMemo(() => {
    return Object.values(items).reduce((acc, item) => {
      const availablePromotions = getAvailablePromotions(item.promotions);
      const totalPromotion = availablePromotions.reduce((acc, pro) => {
        return acc + pro.basicInfo.discount;
      }, 0);

      const selectedModifier = item.modifiers?.[0]?.list?.[0];

      const total = Number(item.price) * item.amount;
      const totalPriceWithDiscount =
        total -
        (!item.discount
          ? 0
          : Number(
              item.discount?.unit === "%"
                ? (total * item.discount?.value) / 100
                : item.discount?.value
            ));

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

  console.log("Subtotal calc:", total);
  return Number(total.toFixed(2));
};
export default usePosOrderLineState;
export { usePosOrderLineSubtotal };
