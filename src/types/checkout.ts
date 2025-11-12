import type { TCartItem } from "./item";

export type TCheckoutFormDataValues = {
  dineIn: {
    tableNumber: string;
    yourName: string;
    phoneNumber: string;
  };
  pickup: {
    yourName: string;
    phoneNumber: string;
    time: "ASAP" | "Other Time";
  };
  delivery: TDeliveryOrderInfo;
  gratuity: string;
  shippingMethod: string;
  feeSummary: TFeeSummary;
  paymentInfo: {
    methodId: string;
  };
  createdAt: string;
  createdBy: string;
  status?: "pending" | "success";
  orderStatus?: "accepted" | "rejected" | "pending";
};

export type TFeeSummary = {
  subTotal: number;
  tax: number;
  serviceFee: number;
  tip: number;
  paymentProcessingFee: number;
  total: number;
};

export type TOrderCartItem = {
  id: string;
  image: string;
  name: string;
  quantity: number;
  price: string;
  modifier?: {
    name: string;
    price: string;
  };
};

export type TOrder = {
  id: string;
  basicInfo: TCheckoutFormDataValues & { restaurantId: string };
  cartItems: TOrderCartItem[];
};

export type TOrderDocumentData = TOrder & {
  cartItems: {
    [key: string]: TOrderCartItem;
  };
};

export type TDeliveryOrderInfo = {
  yourName: string;
  phoneNumber: string;
  deliveryInfo: {
    restaurantAddress: string;
    yourAddress: {
      streetAddress: string;
      city: string;
      receivedAt: string;
      state: string;
      zip: string;
    };
    note: string;
    dropOffOption: "hand-it-to-me" | "leave-at-door";
  };
};
