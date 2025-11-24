import type { CSSProperties } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TElementProperties = {
  style?: CSSProperties & {
    iconColor?: string | CSSProperties["color"];
    statisticCountColor?: string | CSSProperties["color"];
    activeColor?: string | CSSProperties["color"];
  };
  text?: string | number;
  type: "text" | "button" | "list" | "checkbox" | "general";
  displayName: string;
  data?: Record<string, any>;
};

export type TPartEditorData = {
  isHidden?: boolean;
  elements: Record<string, TElementProperties>;
};

type TTemplateEditorStateStore = {
  header: TPartEditorData;
  footer: TPartEditorData;
};

type TTemplateEditorStackStateStore = {
  stackUndo: TTemplateEditorStateStore[];
  stackRedo: TTemplateEditorStateStore[];
};

type TTemplateEditorFunctionStore = {
  set: (
    key: string,
    partEditorData: Record<string, TElementProperties>
  ) => void;
  setHidden: (key: string, isHidden: boolean) => void;
};

type TStoreState = TTemplateEditorStateStore &
  TTemplateEditorStackStateStore &
  TTemplateEditorFunctionStore;
const usePhoCharlestonEditor = create<TStoreState>()(
  persist(
    (set, get) => ({
      stackRedo: [],
      stackUndo: [],
      header: {
        isHidden: false,
        elements: {
          general: {
            displayName: "",
            type: "general",
            style: {
              backgroundColor: "#ffffff",
              color: "#000000",
            },
          },
          nav: {
            type: "list",
            displayName: "Navigation Items",
            style: {
              activeColor: '#ff0000'
            },
            data: {
              items: [
                { label: "MENU", href: "/menu" },
                { label: "DRINKS", href: "/drinks" },
                { label: "SPECIALS", href: "/specials" },
                { label: "ORDER", href: "/order" },
                { label: "RESERVE", href: "/reserve" },
                { label: "PARTIES", href: "/parties" },
                { label: "CATERING", href: "/catering" },
                { label: "JOBS", href: "/jobs" },
              ],
            },
          },

        },
      },
      footer: {
        isHidden: false,
        elements: {},
      },
      set: (key, newData) => {
        const relatedKey = key as keyof TTemplateEditorStateStore;
        const prevData = get()[relatedKey];
        return set({
          [relatedKey]: {
            ...prevData,
            elements: { ...prevData.elements, ...newData },
          },
        });
      },
      setHidden: (key, isHidden) => {
        const relatedKey = key as keyof TTemplateEditorStateStore;
        const prevData = get()[relatedKey];

        set({ [relatedKey]: { ...prevData, isHidden } });
      },
    }),
    {
      name: "usePhoCharlestonEditor",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePhoCharlestonEditor;
