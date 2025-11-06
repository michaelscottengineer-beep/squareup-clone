import { create } from "zustand";

type TBellSoundStore = {
  isRing: boolean;
  clear: () => void;
  set: (isRing: boolean) => void;
};

const useBellSound = create<TBellSoundStore>((set, get) => ({
  isRing: false,
  clear: () => set({ isRing: false }),
  set: (isRing) => set({ isRing }),
}));

export default useBellSound;
