export type TRating = {
  basicInfo: {
    content: string;
    rate: number;
    itemId: string;
    images: { id: string; value: string }[];
  };
};
