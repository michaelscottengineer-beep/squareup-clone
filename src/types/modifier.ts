export type TModifierListItem = {
  id: string;
  name: string;
  price: string;
  hideOnline?: boolean;
  preSelect?: boolean;
  inStock?: boolean;
};

export type TModifier = {
  id: string;
  name: string;
  displayName: string;
  locations?: string[];
  kind: "list" | "text";
  items: TModifierListItem[]
};
