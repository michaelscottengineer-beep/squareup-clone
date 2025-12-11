import type { CSSProperties } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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
  order?: number;
  elements: Record<string, TElementProperties>;
};

type TOtherState = {
  isEditing?: boolean;
};
export type TTemplateEditorStateStore = {
  header: TPartEditorData;
  footer: TPartEditorData;
  sections: {
    [sectionName: string]: TPartEditorData;
  };    
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
  setSection: (
    key: string,
    partEditorData: Record<string, TElementProperties>
  ) => void;
  setAllData: (data: TTemplateEditorStateStore) => void;
  setHidden: (key: string, isHidden: boolean) => void;
  addStack: (data: TTemplateEditorStateStore, type: "undo" | "redo") => void;
  removeStack: (type: "undo" | "redo") => void;
  toggleEdit: (o: boolean) => void;
};

type TStoreState = TTemplateEditorStateStore &
  TTemplateEditorStackStateStore &
  TTemplateEditorFunctionStore &
  TOtherState;
const useTemplate1Editor = create<TStoreState>()(
  persist(
    (set, get) => ({
      isEditing: false,
      stackRedo: [],
      stackUndo: [],
      sections: {
        body: {
          isHidden: false,
          elements: {
            newsLetterTitle: {
              displayName: "NewsLetter Title",
              type: "text",
              text: "Your title here",
              style: {
                fontWeight: "bold",
                fontSize: "40px",
              },
            },
            newsLetterDescription: {
              displayName: "News Letter Description",
              type: "text",
              text: "Start by replacing the full-width header and main images with your own, or use a solid color background.",
              style: {
                color: "gray",
              },
            },
            newsLetterCTAButton: {
              displayName: "Redirect Button",
              type: "button",
              text: "Call to action",
              style: {
                backgroundColor: "#000",
                color: "white",
                borderRadius: "5px",
                padding: "5px 40px",
                margin: "20px auto",
                cursor: "pointer",
              },
              data: {
                url: "/catering",
              },
            },

            layout: {
              displayName: "Change Layout",
              type: "layout",
              data: {
                value: "TTB",
              },
            },
          },
        },
        gmailFooter: {
          isHidden: false,
          elements: {
            logo: {
              displayName: "Logo Initials",
              type: "text",
              text: "TC",
              style: {
                fontWeight: "bold",
                fontSize: "20px",
                color: "white",
                background:
                  "linear-gradient(to bottom right, #2563eb, #1e3a8a)",
                width: "64px",
                height: "64px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            },

            brandName: {
              displayName: "Brand Name",
              type: "text",
              text: "TechCorp Solutions",
              style: {
                fontWeight: "bold",
                fontSize: "18px",
                color: "#111827",
              },
            },

            slogan: {
              displayName: "Brand Slogan",
              type: "text",
              text: "Innovation in Technology & Business Solutions",
              style: {
                fontStyle: "italic",
                fontSize: "14px",
                color: "#4b5563",
              },
            },

            address: {
              displayName: "Address",
              type: "text",
              text: "123 Innovation Drive, Suite 500, San Francisco, CA 94105, United States",
              style: {
                color: "#374151",
                fontSize: "14px",
              },
            },

            phone: {
              displayName: "Phone",
              type: "text",
              text: "+1 (415) 555-0123",
              style: {
                color: "#374151",
                fontSize: "14px",
              },
            },

            email: {
              displayName: "Email",
              type: "text",
              text: "info@techcorp.com",
              style: {
                color: "#2563eb",
                fontSize: "14px",
              },
              data: {
                url: "mailto:info@techcorp.com",
              },
            },

            website: {
              displayName: "Website",
              type: "text",
              text: "www.techcorp.com",
              style: {
                color: "#2563eb",
                fontSize: "14px",
              },
              data: {
                url: "https://www.techcorp.com",
              },
            },

            disclaimer: {
              displayName: "Disclaimer",
              type: "text",
              text: "Confidentiality Notice: This email and any attachments are confidential...",
              style: {
                color: "#6b7280",
                fontSize: "12px",
              },
            },
          },
        },
      },
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
          logo: {
            type: "image",
            displayName: "",
            data: {
              src: "/banner.jpg",
            },
          },
        },
      },

      footer: {
        isHidden: false,
        elements: {
          brandName: {
            displayName: "Brand Name",
            type: "button",
            text: "TDMU Brand - News Letter",
            style: {
              fontSize: "18px",
              color: "#ffffff",
              backgroundColor: "#537a82",
            },
            data: {
              url: "/catering",
            },
          },
          address: {
            displayName: "Address",
            type: "button",
            text: "hvl, 123123, Ho Chi Minh",
            style: {
              fontSize: "18px",
              color: "#ffffff",
              backgroundColor: "#537a82",
            },
            data: {
              url: "/catering",
            },
          },
          description: {
            displayName: "Description",
            type: "button",
            text: "You've received this email because you've subscribed to our newsletter.",
            style: {
              fontSize: "18px",
              color: "#ffffff",
              backgroundColor: "#537a82",
            },
            data: {
              url: "/catering",
            },
          },
        },
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
      setSection: (key, newData) => {
        const relatedKey = key as keyof TTemplateEditorStateStore;
        const prevData = get().sections[relatedKey];
        return set({
          sections: {
            ...get().sections,
            [relatedKey]: {
              ...prevData,
              elements: { ...prevData.elements, ...newData },
            },
          },
        });
      },
      setAllData: (data) => {
        return set({ ...data });
      },
      setHidden: (key, isHidden) => {
        const relatedKey = key as keyof TTemplateEditorStateStore;
        const prevData = get()[relatedKey];

        set({ [relatedKey]: { ...prevData, isHidden } });
      },

      addStack: (data, type) => {
        if (type === "undo")
          return set({ stackUndo: [...get().stackUndo, data] });
        return set({ stackRedo: [...get().stackRedo, data] });
      },
      removeStack: (type) => {
        if (type === "undo") {
          const arr = get().stackUndo;

          return set({ stackUndo: arr.slice(0, arr.length - 1) });
        }

        const arr = get().stackRedo;
        return set({ stackRedo: arr.slice(0, arr.length - 1) });
      },
      toggleEdit: (o) => set({ isEditing: o }),
    }),
    {
      name: "useTemplate1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTemplate1Editor;
