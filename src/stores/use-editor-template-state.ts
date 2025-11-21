import type { CSSProperties } from "react";
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

export type TElementProperties = {
  style?: CSSProperties;
  text?: string | number;
  type: "text" | "button" | "list" | "checkbox" | "general";
  displayName: string;
  data?: Record<string, any>;
};

export type TPartEditorData = {
  header: Record<string, TElementProperties>;
  footer: Record<string, TElementProperties>;
  sections: Record<string, Record<string, TElementProperties>>;
};

type TEditorTemplateStateStore = {
  partEditorData: TPartEditorData;
  set: (partEditorData: Partial<TPartEditorData>) => void;
};

const useEditorTemplateState = create<TEditorTemplateStateStore>()(
  persist(
    (set, get) => ({
      partEditorData: {
        header: {
          hidden: {
            displayName: "",
            type: "checkbox",
            style: {},
            data: {
              isChecked: false,
              label: "Hidden This Section?",
            },
          },
          general: {
            displayName: "",
            type: "general",
            style: {
              backgroundColor: "#ffffff",
              color: "#000000",
            },
          },
          navigation: {
            displayName: "Header navigation",
            type: "list",
            data: {
              items: [
                {
                  label: "Section 1",
                  url: "#section1",
                  isActive: false,
                },
              ],
            },
            style: {
              display: "flex",
            },
          },
          pageName: {
            displayName: "Page Name",
            type: "text",
            text: "La Cuisine",
            style: {
              color: "#1d293d",
              fontWeight: "bold",
              fontSize: "24px",
            },
          },
        },
        footer: {},
        sections: {},
      },
      set: (partEditorData) =>
        set({ partEditorData: { ...get().partEditorData, ...partEditorData } }),
    }),
    {
      name: "useEditorTemplateState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditorTemplateState;
