import type { TCategory } from "@/types/category";
import type { TModifier } from "@/types/modifier";
import { create } from "zustand";

type TItemCreationFormDataStore = {
  categories: TCategory[];
  setCategories: (categories: TCategory[]) => void;
  modifiers: TModifier[];
  setModifiers: (modifiers: TModifier[]) => void;
};

const useItemCreationFormData = create<TItemCreationFormDataStore>((set) => ({
  categories: [],
  modifiers: [],
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
}));

export default useItemCreationFormData;
