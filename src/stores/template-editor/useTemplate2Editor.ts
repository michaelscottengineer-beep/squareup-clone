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
  key?: string;
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
  setSectionElement: (
    key: string,
    elmKey: string,
    partEditorData: Partial<TElementProperties>
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

const useTemplate2Editor = create<TStoreState>()(
  persist(
    immer((set, get) => ({
      isEditing: false,
      stackRedo: [],
      stackUndo: [],

      footer: {
        isHidden: false,
        elements: {
          footerWrapper: {
            displayName: "Outer Footer Wrapper",
            type: "layout",
            style: {
              backgroundColor: "#f3f4f6",
              paddingTop: "24px",
              paddingBottom: "24px",
            },
          },
          socialIconsBlock: {
            displayName: "Social Icons Block",
            type: "layout",
            style: {
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "24px",
            },
          },
          socialFacebook: {
            displayName: "Facebook Icon",
            type: "button",
            style: {
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1877f2",
              cursor: "pointer",
            },
            data: {
              url: "#",
              icon: "Facebook",
            },
          },
          socialCustom1: {
            displayName: "Custom Icon (SVG)",
            type: "button",
            style: {
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000",
              cursor: "pointer",
            },
            data: {
              url: "#",
              icon: "CustomSVG",
            },
          },
          socialYoutube: {
            displayName: "YouTube Icon",
            type: "button",
            style: {
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ff0000",
              cursor: "pointer",
            },
            data: {
              url: "#",
              icon: "Youtube",
            },
          },
          socialInstagram: {
            displayName: "Instagram Icon",
            type: "button",
            style: {
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              cursor: "pointer",
            },
            data: {
              url: "#",
              icon: "Instagram",
            },
          },
          footerLegalTitle: {
            displayName: "Legal Title",
            type: "text",
            text: "Legal Notice",
            style: {
              fontWeight: 600,
              color: "#4b5563",
              marginBottom: "8px",
              textAlign: "center",
            },
          },
          footerAddress: {
            displayName: "Footer Address",
            type: "text",
            text: "idmu | hxl | Ho Chi Minh",
            style: {
              color: "#6b7280",
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "6px",
            },
          },
          footerContact: {
            displayName: "Footer Contact",
            type: "text",
            text: "Telephone 0123 456 789 | example@company.com | www.yourcompany.com",
            style: {
              color: "#6b7280",
              fontSize: "14px",
              textAlign: "center",
            },
          },
        },
      },

      sections: {
        header: {
          isHidden: false,
          elements: {
            wrapper: {
              displayName: "Wrapper",
              type: "general",
              style: {
                minHeight: "100vh",
                backgroundColor: "#f3f4f6",
                padding: "16px",
              },
            },
            container: {
              displayName: "Container",
              type: "layout",
              style: {
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 15px rgba(0,0,0,0.08)",
                overflow: "hidden",
              },
            },
            logoBlock: {
              displayName: "Logo Block",
              type: "layout",
              style: {
                textAlign: "center",
                paddingTop: "32px",
                paddingBottom: "32px",
                paddingLeft: "20px",
                paddingRight: "20px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#ffffff",
              },
            },
            logoImage: {
              displayName: "Logo Image",
              type: "image",
              data: {
                src: "https://img.mailinblue.com/2670624/images/rnb/original/5ea02d3c55140c52de0a747d.png",
                alt: "Logo",
              },
              style: {
                maxWidth: "220px",
                width: "100%",
                height: "auto",
                display: "block",
              },
            },
          },
        },
        main: {
          isHidden: false,
          order: 0,
          elements: {
            // Hero image block
            heroImage: {
              displayName: "Hero Image",
              type: "image",
              data: {
                src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop",
                alt: "Beach with sunglasses",
              },
              style: {
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              },
            },

            // Greeting
            greetingTitle: {
              displayName: "Greeting Title",
              type: "text",
              text: "Dear Customer,",
              style: {
                color: "#0088bb",
                fontSize: "20px",
                fontWeight: 600,
                marginTop: "24px",
                marginBottom: "16px",
                textAlign: "center",
              },
              key: "greetingTitle",
            },
            greetingParagraph: {
              displayName: "Greeting Paragraph",
              type: "text",
              text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
              key: "greetingParagraph",
              style: {
                color: "#4b5563",
                lineHeight: "1.6",
                textAlign: "justify",
                paddingLeft: "24px",
                paddingRight: "24px",
                marginBottom: "24px",
                fontSize: "14px",
              },
            },

            // spacing / container metadata for rendering order if needed
            contentSpacing: {
              displayName: "Content Spacing Helper",
              type: "general",
              style: {
                paddingBottom: "24px",
              },
            },
          },
        },

        offerCard1: {
          isHidden: false,
          elements: {
            // Offer Card 1 - left image, right content (we flatten to elements)
            offer1Image: {
              displayName: "Image",
              type: "image",
              data: {
                src: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=700&fit=crop",
                alt: "Thailand beach",
              },
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              },
            },
            offer1Panel: {
              displayName: "Panel",
              type: "layout",
              style: {
                backgroundColor: "#5eb3d6",
                color: "#ffffff",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            },
            offer1Title: {
              displayName: "Title",
              type: "text",
              text: "Enter Headline Here",
              style: {
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "16px",
              },
            },
            offer1Description: {
              displayName: "Description",
              type: "text",
              text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
              style: {
                fontSize: "12px",
                lineHeight: "1.6",
                marginBottom: "20px",
              },
            },
            offer1PriceMain: {
              displayName: "Price",
              type: "text",
              text: "625,00 €",
              style: {
                fontSize: "30px",
                fontWeight: 700,
                marginRight: "8px",
                display: "inline-block",
              },
            },
            offer1PriceOld: {
              displayName: "Old Price",
              type: "text",
              text: "799,00 €",
              style: {
                fontSize: "16px",
                textDecoration: "line-through",
                opacity: 0.8,
                display: "inline-block",
                marginLeft: "8px",
              },
            },
            offer1Button: {
              displayName: "Button",
              type: "button",
              text: "BOOK NOW",
              data: {
                url: "https://booknow",
              },
              style: {
                width: "100%",
                paddingTop: "4px",
                paddingBottom: "4px",
                border: "2px solid #ffffff",
                backgroundColor: "transparent",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              },
            },
          },
        },
        offerCard2: {
          elements: {
            // Offer Card 2 (mirrored)
            offer2Image: {
              displayName: "Image",
              type: "image",
              data: {
                src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=700&fit=crop",
                alt: "Maldives beach",
              },
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              },
            },
            offer2Panel: {
              displayName: "Panel",
              type: "layout",
              style: {
                backgroundColor: "#0d5273",
                color: "#ffffff",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            },
            offer2Title: {
              displayName: "Title",
              type: "text",
              text: "Enter Headline Here",
              style: {
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "16px",
              },
            },
            offer2Description: {
              displayName: "Description",
              type: "text",
              text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
              style: {
                fontSize: "12px",
                lineHeight: "1.6",
                marginBottom: "20px",
              },
            },
            offer2PriceMain: {
              displayName: "Price",
              type: "text",
              text: "515,00 €",
              style: {
                fontSize: "30px",
                fontWeight: 700,
                display: "inline-block",
                marginRight: "8px",
              },
            },
            offer2PriceOld: {
              displayName: "Old Price",
              type: "text",
              text: "659,00 €",
              style: {
                fontSize: "16px",
                textDecoration: "line-through",
                opacity: 0.8,
                display: "inline-block",
              },
            },
            offer2Button: {
              displayName: "Button",
              type: "button",
              text: "BOOK NOW",
              data: {
                url: "https://booknow",
              },
              style: {
                width: "100%",
                paddingTop: "4px",
                paddingBottom: "4px",
                border: "2px solid #ffffff",
                backgroundColor: "transparent",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              },
            },
          },
        },
        ctaSection: {
          elements: {
            // CTA section
            ctaPanel: {
              displayName: "CTA Panel",
              type: "layout",
              style: {
                backgroundColor: "#ffffff",
                paddingTop: "32px",
                paddingBottom: "32px",
                paddingLeft: "24px",
                paddingRight: "24px",
                textAlign: "center",
              },
            },
            ctaHeadline: {
              displayName: "CTA Headline",
              type: "text",
              text: "Enter Headline Here",
              style: {
                color: "#0088bb",
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "12px",
              },
            },
            ctaParagraph: {
              displayName: "CTA Paragraph",
              type: "text",
              text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,",
              style: {
                color: "#4b5563",
                fontSize: "14px",
                lineHeight: "1.6",
                maxWidth: "520px",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "20px",
              },
            },
            ctaButton: {
              displayName: "CTA Button",
              type: "button",
              text: "CLICK HERE",
              data: {
                url: "https://clichere",
              },
              style: {
                paddingLeft: "48px",
                paddingRight: "48px",
                paddingTop: "12px",
                paddingBottom: "12px",
                backgroundColor: "#5eb3d6",
                color: "#ffffff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                display: "inline-block",
              },
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
      setSectionElement: (key, elmKey, newData) => {
        return set((state) => {
          const selectedSection = state.sections[key];
          const elm = selectedSection.elements[elmKey];
          state.sections[key].elements[elmKey] = { ...elm, ...newData };
          return state;
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
    })),
    {
      name: "useTemplate2Editor",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTemplate2Editor;
