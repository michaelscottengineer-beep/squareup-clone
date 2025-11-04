export type Promotion = {
  title: string;
  discount: number;
  status: "Active" | "Upcoming";
  schedule: {
    dates: string[];
    time?: string;
    repeat?: string;
  };
  appliedTo: {
    type: "All" | "Items";
    items?: string[];
  };
};