import type { TPaymentMethod } from "./payment"

export type TPaymentIntentListItem = { 
  userPaymentMethod: TPaymentMethod
  amount: number;
  id: string;
  status: "succeeded" | "canceled";
  currency: "usd";
  created: number;
  metadata: {
    shopId: string;
    orderId: string;
  }
}