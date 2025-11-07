import type { TOrder } from "./checkout";

export type TOrderHistory = {
  id: string;
  basicInfo: {
    orderId: string;
    status: "accepted" | "rejected";
    createdAt: string;
    createdBy: string;
    createdByObj: {
      email: string;
    }
  };
};

export type TOrderHistoryDocumentData = TOrderHistory & {};
