import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TCurrentRestaurantIdStore = {
  id: string;
  clear: () => void;
  set: (value: string) => void;
};

const useCurrentRestaurantId = create<TCurrentRestaurantIdStore>()(persist((set) => ({
  id: "",
  clear: () => set({ id: "" }),
  set: (value) => set({ id: value }), 
}), {
  name: 'current-restaurant-id',
    storage: createJSONStorage(() => localStorage),
}));

export default useCurrentRestaurantId;
