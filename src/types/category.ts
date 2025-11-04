import type { TItem } from "./item";

export type TCategory = {
  id: string;
  basicInfo: {
    name: string;
    image: string;
    parentId: string;
    hasChannel?: boolean;
  };
  items: TItem[];
};

export type TCategoryV2 = {
  id: string;
  basicInfo: {
    name: string;
    image: string;
    parentId: string;
    hasChannel?: boolean;
  };
  items: {
    [id: string]: TItem;
  };
};

export type TCategoryDocumentData = {
  id: string;
  basicInfo: {
    name: string;
    parentId: string;
    image: string;
  };
  items: {
    [id: string]: TItem;
  };
};
