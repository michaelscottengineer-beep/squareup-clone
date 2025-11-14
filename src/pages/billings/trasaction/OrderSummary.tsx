import { Separator } from "@/components/ui/separator";
import type { TOrderDocumentData } from "@/types/checkout";
import React from "react";

const OrderSummary = ({ order }: { order: TOrderDocumentData }) => {
  return (
    <div className="space-y-2 text-sm border border-border rounded-lg p-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>${order.basicInfo.feeSummary?.subTotal?.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Online Payment Processing</span>
        <span>
          ${order.basicInfo.feeSummary?.paymentProcessingFee?.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">Free</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Tax</span>
        <span>${order.basicInfo.feeSummary?.tax?.toFixed(2)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-base font-bold text-gray-900">
        <span>Total</span>
        <span>${order.basicInfo.feeSummary?.total?.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
