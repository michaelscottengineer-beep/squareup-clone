export type TOption = {
  id: string;
  basicInfo: {
    name: string;
    displayName: string;
    type: "text" | "text-color";
  };
  list: TOptionListItem[];
};

export type TOptionListItem = {
  name: string;
  color?: string;
};
