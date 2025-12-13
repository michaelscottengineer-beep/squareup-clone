import type { CSSProperties } from "react";

export const columnLayouts = {
  "1": {
    label: "1 Column",
    type: "column",
    numOfCol: 1,
    id: 1,
    children: {
      ['col-0']: [], // rowIds 
      ['col-1']: [], // rowIds 
    }
  },
  "2": {
    label: "2 Column",
    type: "column",
    numOfCol: 2,
    id: 2,
  },
  "3": {
    label: "3 Column",
    type: "column",
    numOfCol: 3,
    id: 3,
  },
  "4": {
    label: "4 Column",
    type: "column",
    numOfCol: 4,
    id: 4,
  },
} as const ;


export const builderElements: {
  [key: string]: { style: CSSProperties } & Record<string, any>;
} = {
  Image: {
    type: "Image",
    id: 1,
    props: {
      src: "https://img.mailinblue.com/2670624/images/rnb/original/5ea02d3c55140c52de0a747d.png",
    },
    label: "Image",
    style: {
      borderRadius: "10px",
    },
  },

  Text: {
    type: "Text",
    id: 1,
    props: {
      text: "Text 1",
    },
    label: "Text",
    style: {
      color: "#333",
      fontSize: "16px",
    },
  },
  Button: {
    type: "Button",
    id: 1,
    props: {
      text: 'Button Text'
    },
    label: "Button",
    style: {
      color: "#fff",
      backgroundColor: "#333",
      fontSize: "16px",
      padding: "10px 20px",
    },
  },
} as const;
