import type { TCategory } from "@/types/category";
import type { TModifier } from "@/types/modifier";
import type { TPromotion } from "@/types/promotion";
import { create } from "zustand";

type TItemCreationFormDataStore = {
  categories: TCategory[];
  setCategories: (categories: TCategory[]) => void;
  modifiers: TModifier[];
  setModifiers: (modifiers: TModifier[]) => void;
  promotions: TPromotion[];
  setPromotions: (promotions: TPromotion[]) => void;
};

const useItemCreationFormData = create<TItemCreationFormDataStore>((set) => ({
  categories: [],
  modifiers: [],
  promotions: [],
  setCategories: (categories: TCategory[]) =>
    set((state) => {
      return {
        ...state,
        categories,
      };
    }),
  setModifiers: (modifiers: TModifier[]) =>
    set((state) => {
      return {
        ...state,
        modifiers,
      };
    }),
  setPromotions: (promotions: TPromotion[]) =>
    set((state) => {
      return {
        ...state,
        promotions,
      };
    }),
}));

export default useItemCreationFormData;
