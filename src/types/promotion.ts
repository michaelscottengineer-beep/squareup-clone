export type TPromotion = {
  id: string;
  basicInfo: {
    title: string;
    discount: number;
    schedule: {
      date: {
        from: string;
        to: string;
      };
      time?: {
        from: string;
        to: string;
      };
      repeat?: string;
    };
    appliedTo?: "All" | any[];
    isDeleted?: boolean;
  };
};
