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
  order?: number;
  elements: Record<string, TElementProperties>;
};

type TTemplateEditorStateStore = {
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
};

type TStoreState = TTemplateEditorStateStore &
  TTemplateEditorStackStateStore &
  TTemplateEditorFunctionStore;
const usePhoCharlestonEditor = create<TStoreState>()(
  persist(
    (set, get) => ({
      stackRedo: [],
      stackUndo: [],
      sections: {
        aboutUsCatering: {
          isHidden: false,
          elements: {
            heading: {
              displayName: "Heading",
              type: "text",
              text: "Catering",
              style: {
                fontSize: "50px",
                color: "#333333",
                fontWeight: "bold",
              },
            },
            subHeading: {
              displayName: "Sub Heading",
              type: "text",
              text: "Let us cater your next event",
              style: {
                fontSize: "20px",
                color: "#5D6E58",
              },
            },
            description: {
              displayName: "Description",
              type: "text",
              text: "Whatever your event, we have the perfect catering options to choose from.",
              style: {
                fontSize: "18px",
                color: "#333333",
              },
            },
            redirectButton: {
              displayName: "Redirect Button",
              type: "button",
              text: "catering",
              style: {
                fontSize: "18px",
                color: "#ffffff",
                backgroundColor: "#537a82",
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
                value: "LTR",
              },
            },
          },
        },
        aboutUsGroupAndParties: {
          isHidden: false,
          elements: {
            heading: {
              displayName: "Heading",
              type: "text",
              text: "Groups and Parties",
              style: {
                fontSize: "50px",
                color: "#333333",
                fontWeight: "bold",
              },
            },
            subHeading: {
              displayName: "Sub Heading",
              type: "text",
              text: "Tailored events for all occasions",
              style: {
                fontSize: "20px",
                color: "#5D6E58",
              },
            },
            description: {
              displayName: "Description",
              type: "text",
              text: "Host your special event at Hạ Long Café. Whatever the occasion, our tailored service will bring your vision to life.",
              style: {
                fontSize: "18px",
                color: "#333333",
              },
            },
            redirectButton: {
              displayName: "Redirect Button",
              type: "button",
              text: "Book an event",
              style: {
                fontSize: "18px",
                color: "#D7D9D6",
                backgroundColor: "#474947",
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
                value: "RTL",
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
                value: "LTR",
              },
            },
          },
        },
        carouselIntroduce: {
          elements: {
            carousel: {
              type: "list",
              displayName: "",
              data: {
                items: [
                  {
                    title: "Authentic</br>Vietnamese cuisine",
                    img: "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/81/9861ff410b4ef3938433b5b80dbe3c/:original",
                    buttonText: "Our menu",
                    buttonUrl: "/my-menu",
                  },
                  {
                    title: "Order online",
                    subTitle: "Take us home with you!",
                    img: "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/1e/81044a6db943a1a357c78b68cc3c05/:original",
                    buttonText: "Order online",
                    buttonUrl: "/order-now",
                  },
                  {
                    title: "Groups</br>and parties",
                    img: "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/1e/81044a6db943a1a357c78b68cc3c05/:original",
                    buttonText: "Book an event",
                    buttonUrl: "/book-event",
                  },
                  {
                    img: "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/98/07525854d34cf9be5e9618e378f43c/:original",
                    title: "Catering",
                    subTitle: "Tailored to your needs",
                    buttonText: "Cater with us",
                    buttonUrl: "/cater",
                  },
                  {
                    img: "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/98/07525854d34cf9be5e9618e378f43c/:original",
                    title: "Taiwanese</br>Bubble tea",
                    buttonText: "our drinks",
                    buttonUrl: "/my-drinks",
                  },
                ],
              },
            },
          },
        },
        special: {
          elements: {
            general: {
              displayName: "",
              type: "general",
              style: {
                backgroundColor: "#3E413D",
                color: "#D7D9D6",
              },
            },
            title: {
              displayName: "Title",
              text: "Specials",
              type: "text",
              style: {
                fontSize: "50px",
                color: "#B9C1B6",
              },
            },
            description: {
              displayName: "Description",
              text: "Breakfast combo: Served every day! Includes coffee and a sandwich. Only $10.99",
              type: "text",
              style: {
                color: "#D7D9D6",
                fontSize: "18px",
              },
            },
            hours: {
              displayName: "Hours ",
              text: "09:00 AM - 11:00 AM",
              type: "text",
              style: {
                fontSize: "18px",
                color: "#D7D9D6",
              },
            },
            redirectButton: {
              type: "button",
              text: "All specials",
              displayName: "",
              data: {
                url: "/specials",
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
          logo: {
            type: "image",
            displayName: "",
            data: {
              src: "/restaurant_placeholder.png",
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
    }),
    {
      name: "usePhoCharlestonEditor",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePhoCharlestonEditor;
