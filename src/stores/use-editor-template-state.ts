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
  style?: CSSProperties & {
    iconColor?: string | CSSProperties["color"];
    statisticCountColor?: string | CSSProperties["color"];
  };
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
  setSection: (
    sectionKey: string,
    sectionPartData: Record<string, TElementProperties>
  ) => void;
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
        sections: {
          statisticSection: {
            general: {
              displayName: "",
              type: "general",
              style: {
                backgroundColor: "#ffffff",
                color: "#45556c",
              },
            },
            stat: {
              type: "list",
              displayName: "Statistic",
              style: {
                statisticCountColor: "#e17100",
                color: "#45556c",
              },
              data: {
                items: [
                  { count: 15, label: "Years of Excellence" },
                  { count: 8, label: "Master Chefs" },
                  { count: 50, label: "Signature Dishes" },
                  { count: 100.0, label: "Happy Guests" },
                ],
              },
            },
          },
          contactSection: {
            title: {
              displayName: "Title",
              style: {
                fontSize: "36px",
                color: "#ffffff",
                fontWeight: "bold",
              },
              type: "text",
              text: "Visit Us Today",
            },
            description: {
              displayName: "Description",
              style: {
                color: "#cad5e2",
              },
              type: "text",
              text: "We're here to serve you an unforgettable experience",
            },
            general: {
              displayName: "",
              type: "general",
              style: {
                backgroundColor: "#1d293d",
                color: "#ffffff",
              },
            },
            contactBlock: {
              displayName: "Blocks",
              type: "list",
              style: {
                backgroundColor: "#314158",
                borderColor: "#45556c",
                color: "#ffffff",
                iconColor: "#ffba00",
              },
              data: {
                items: [
                  {
                    iconName: "mdi-light:clock",
                    title: "Opening Hours",
                    description:
                      "Mon-Sat: 11:00 AM - 10:00 PM | Sun: 12:00 PM - 9:00 PM",
                  },
                  {
                    iconName: "system-uicons:location",
                    title: "Location",
                    description: "123 Gourmet Street, Culinary District",
                  },
                  {
                    iconName: "solar:phone-outline",
                    title: "Contact Us",
                    description: "+1 (555) 123-4567",
                  },
                ],
              },
            },
          },
        },
      },
      set: (partEditorData) =>
        set({ partEditorData: { ...get().partEditorData, ...partEditorData } }),
      setSection: (sectionKey, sectionPartData) =>
        set({
          partEditorData: {
            ...get().partEditorData,
            sections: {
              ...get().partEditorData.sections,
              [sectionKey]: {
                ...get().partEditorData.sections[sectionKey],
                ...sectionPartData,
              },
            },
          },
        }),
    }),
    {
      name: "useEditorTemplateState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEditorTemplateState;
