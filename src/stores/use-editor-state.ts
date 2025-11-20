import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TJsonElement = {
  type: string;
  id: string;
  position: {
    x: number;
    y: number;
  };
  style: {
    [key: string]: any;
  };
  [key: string]: any;
};

type TEditorStateStore = {
  activeId: string;
  html: TJsonElement[];
  clear: () => void;
  add: (value: TJsonElement) => void;
  set: (value: TJsonElement[]) => void;
  setActiveId: (activeId: string) => void;
  update: (id: string, data: TJsonElement) => void;
};

const useEditorState = create<TEditorStateStore>()(
  persist(
    (set, get) => ({
      html: [],
      activeId: "",
      add: (value) => set({ html: [...get().html, value] }),
      clear: () => set({ html: [] }),
      set: (value) => set({ html: value }),
      setActiveId: (value) => set({ activeId: value }),
      update: (id, data) =>
        set({
          html: get().html.map((json) => {
            if (json.id === id) return { ...json, ...data };
            return json;
          }),
        }),
    }),
    {
      name: "web-editor-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditorState;
