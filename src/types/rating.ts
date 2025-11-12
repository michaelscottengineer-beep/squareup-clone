import type { TOrderDocumentData } from "./checkout";
import type { TUser } from "./user";

export type TRating = {
  id: string;
  basicInfo: {
    content: string;
    rate: number;
    itemId: string;
    orderId: string;
    images: { id: string; value: string }[];
    createdBy: string;
    orderInfo: TOrderDocumentData;
    itemInfo: TOrderDocumentData["cartItems"][number];
    userInfo: TUser;
  };
};
