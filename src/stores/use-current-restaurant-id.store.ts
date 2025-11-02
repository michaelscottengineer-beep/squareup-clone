import { create } from "zustand";

type TCurrentRestaurantIdStore = {
  id: string;
  clear: () => void;
  set: (value: string) => void;
};

const useCurrentRestaurantId = create<TCurrentRestaurantIdStore>((set) => ({
  id: "",
  clear: () => set({ id: "" }),
  set: (value) => set({ id: value }),
}));

export default useCurrentRestaurantId;
