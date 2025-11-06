import React from "react";
import { useParams } from "react-router";
import { DataTable } from "@/components/ui/data-table";
import type { TCartItem, TItem } from "@/types/item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, push, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import { useNavigate } from "react-router";

import type {
  TOrder,
  TOrderCartItem,
  TOrderDocumentData,
} from "@/types/checkout";
import { formatDate } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: order, isLoading } = useQuery({
    queryKey: ["allOrders", "details", orderId],
    queryFn: async () => {
      const path = parseSegments(
        "restaurants",
        restaurantId,
        "allOrders",
        orderId
      );

      const ordersRef = ref(db, path);
      const snap = await get(ordersRef);

      return (snap.val() ? snap.val() : {}) as TOrderDocumentData;
    },
    enabled: !!restaurantId && !!orderId,
  });

  if (!order) {
    return <div>Not found</div>;
  }

  return (
    <div className="container max-w-1/2 space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="mb-1 font-semibold text-2xl">Order ID: {orderId}</h1>
        <div className="bg-yellow-50 text-yellow-500 font-semibold py-1  px-4 w-max text-sm border-yellow-500 rounded-md">
          Payment {order.basicInfo.status}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="date">
          {formatDate(new Date(order?.basicInfo.createdAt), "dd/MM/yyyy")}
        </span>
        <span>from</span>
        <span>
          {order.basicInfo?.delivery?.yourName ??
            order.basicInfo?.dineIn?.yourName ??
            order.basicInfo?.pickup?.yourName ??
            order.basicInfo.createdBy}
        </span>
      </div>

      <div className="order-items mt-8  border border-border rounded-lg p-4">
        <h2 className="text-xl font-semibold">Order Items</h2>
        {convertFirebaseArrayData<TOrderCartItem>(order.cartItems).map(
          (item) => {
            const totalItem = Number(item?.price ?? 1) * item.quantity;
            const totalModifier = item.modifier
              ? Number(item.modifier.price ?? 0) * item.quantity
              : 0;

            return (
              <div key={item.id} className="flex items-center gap-4">
                <div className="img w-8 bg-red-50 rounded-lg h-full aspect-square"></div>
                <div className="grid grid-cols-[1fr_auto] text-sm gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-semibold">{item.name} </p>
                    <p className="text-gray-500">(Qty: {item.quantity})</p>
                  </div>
                  <p className="font-medium text-gray-500">
                    ${totalItem.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500">
                      Toppings: {item.modifier ? item.modifier.name : "None"}
                    </p>
                    <p className="text-gray-500">
                      (Qty: {item.modifier ? item.quantity : 0})
                    </p>
                  </div>

                  <p className="font-medium text-gray-500">
                    ${totalModifier.toFixed(2)}
                  </p>

                  <p className="col-span-2 font-semibold text-gray-900 text-end ">
                    <span className="border-t border-t-gray-900">Total: </span>
                    <span className="border-t border-t-gray-900">
                      {(totalModifier + totalItem).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="order-info  border border-border rounded-lg p-4" >
        <h2 className="text-xl font-semibold mb-2">Order Info</h2>
        {order.basicInfo.shippingMethod === "Delivery" && <OrderInfoDelivery order={order} />}
        {order.basicInfo.shippingMethod === "Dine In" && <OrderInfoDineIn order={order} />}
      </div>

      {/* Order Summary */}
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
    </div>
  );
};

const OrderInfoDineIn = ({ order }: { order: TOrder }) => {
  return (
    <>
      <div className="grid grid-cols-2">
        <span>Table Number:</span>
        <span className="text-end">{order.basicInfo.dineIn.tableNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Phone Number:</span>
        <span className="text-end">{order.basicInfo.dineIn.phoneNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>FullName:</span>
        <span className="text-end">{order.basicInfo.dineIn.yourName}</span>
      </div>
    </>
  );
};

const OrderInfoDelivery = ({ order }: { order: TOrder }) => {
  const delivery = order.basicInfo.delivery;
  const { yourAddress } = delivery.deliveryInfo;

  return (
    <>
      <div className="grid grid-cols-2">
        <span>Phone Number:</span>
        <span className="text-end">{delivery.phoneNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>FullName:</span>
        <span className="text-end">{delivery.yourName}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Street Address:</span>
        <span className="text-end">{yourAddress.streetAddress}</span>
      </div>
      <div className="grid grid-cols-2">
        <span>Received At:</span>
        <span className="text-end">{yourAddress.receivedAt}</span>
      </div>
      <div className="grid grid-cols-2">
        <span>City:</span>
        <span className="text-end">{yourAddress.city}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>State:</span>
        <span className="text-end">{yourAddress.state}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Notes:</span>
        <span className="text-end">{delivery.deliveryInfo.note}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Drop-off:</span>
        <span className="text-end">{delivery.deliveryInfo.dropOffOption}</span>
      </div>
    </>
  );
};

export default OrderDetail;
