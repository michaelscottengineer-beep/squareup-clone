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
  type:
    | "text"
    | "button"
    | "list"
    | "checkbox"
    | "general"
    | "image"
    | "layout";
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
  aboutUs: TPartEditorData;
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
              activeColor: "#ff0000",
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
      aboutUs: {
        isHidden: false,
        elements: {
          heading: {
            displayName: "Heading",
            type: "text",
            text: "About Us",
            style: {
              fontSize: "50px",
              color: "#333333",
              fontWeight: "bold",
            },
          },
          subHeading: {
            displayName: "Sub Heading",
            type: "text",
            text: "Hạ Long Café",
            style: {
              fontSize: "20px",
              color: "#5D6E58",
            },
          },
          description: {
            displayName: "Description",
            type: "text",
            text: "Authenticate Vietnamese food and bubble tea owned by a Vietnamese family in downtown Charleston.",
            style: {
              fontSize: "18px",
              color: "#333333",
            },
          },
          redirectButton: {
            displayName: "Redirect Button",
            type: "button",
            text: "OUR MENU",
            style: {
              fontSize: "18px",
              color: "#D7D9D6",
              backgroundColor: "#474947",
              padding: "20px 20px",
            },
          },
          image: {
            displayName: "Image",
            type: "image",
            style: {},
            data: {
              src: "/about_right_2.jpg",
            },
          },
          layout: {
            displayName: "Change Layout",
            type: "layout",
            data: {
              value: "LTR"
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
