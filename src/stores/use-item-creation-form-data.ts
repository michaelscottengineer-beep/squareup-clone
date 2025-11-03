import type { TCategory } from "@/types/category";
import { create } from "zustand";

type TItemCreationFormDataStore = {
  categories: TCategory[];
  setCategories: (categories: TCategory[]) => void;
};

const useItemCreationFormData = create<TItemCreationFormDataStore>((set) => ({
  categories: [],
  setCategories: (categories: TCategory[]) =>
    set((state) => {
      return {
        ...state,
        categories,
      };
    }),
}));

export default useItemCreationFormData;
