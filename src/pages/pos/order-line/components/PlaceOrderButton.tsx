import { Button } from "@/components/ui/button";
import { POS_PAYMENT } from "@/config";
import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import { db } from "@/firebase";
import useAuth from "@/hooks/use-auth";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import usePosOrderLineState, {
  usePosOrderLineSubtotal,
} from "@/stores/use-pos-order-line-state";
import type { TCheckoutFormDataValues } from "@/types/checkout";
import type { TRestaurantTable } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { get, push, ref, update } from "firebase/database";
import { useEffect, useRef } from "react";
import { CiDesktopMouse2 } from "react-icons/ci";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

const PlaceOrderButton = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const tableNumber = usePosOrderLineState((state) => state.tableNo);
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const subTotal = usePosOrderLineSubtotal();
  const queryClient = useQueryClient();

  const { mutate: handlePlaceOrder } = useMutation({
    mutationFn: async () => {
      if (!tableNumber) {
        throw new Error("Table number is required");
      }
      const data: Pick<
        TCheckoutFormDataValues,
        | "dineIn"
        | "orderStatus"
        | "feeSummary"
        | "createdBy"
        | "status"
        | "paymentInfo"
        | "shippingMethod"
        | "createdAt"
      > = {
        dineIn: {
          tableNumber,
          phoneNumber: "",
          yourName: "",
        },
        orderStatus: "pending",
        createdBy: user?.uid ?? "",
        status: "pending",
        paymentInfo: {
          methodId: "unknown",
        },
        feeSummary: {
          paymentProcessingFee: 1,
          serviceFee: 1,
          subTotal: subTotal,
          tax: POS_PAYMENT.TAX,
          tip: 0,
          total: subTotal + POS_PAYMENT.TAX,
        },
        shippingMethod: "Dine In",
        createdAt: new Date().toISOString(),
      };
      const items = Object.values(selectedItems);

      const updates: { [key: string]: any } = {};

      const keys = orderFirebaseKey({ restaurantId });

      const newOrderId = push(keys.rootRef()).key;
      keys.addParams({ orderId: newOrderId });

      const noticePath = parseSegments(
        "restaurants",
        restaurantId,
        "allNotifications"
      );
      const noticeId = push(ref(db, noticePath)).key;
      const tableStatusPath = parseSegments(
        "restaurants",
        restaurantId,
        "allTables",
        tableNumber,
        "status"
      );

      const paymentInfoPath = parseSegments(keys.details(), "paymentInfo");
      // const cartItemsPath = parseSegments(keys.details(), "cartItems");
      updates[tableStatusPath] = {
        bookedAt: new Date().toISOString(),
        numberOfPeople: 2,
        paymentStatus: "paid",
        tableStatus: "on dine",
      } as TRestaurantTable["status"];
      updates[keys.basicInfo()] = {
        ...data,
      };

      for (const item of items) {
        const orderItemPath = parseSegments(
          keys.details(),
          "cartItems",
          item.id
        );
        const selectedModifier = item.modifiers?.[0]?.list?.[0];
        updates[orderItemPath] = {
          price: item.price,
          image: item.image,
          name: item.name,
          quantity: item.amount,
          modifier: selectedModifier
            ? {
                name: selectedModifier.name,
                price: selectedModifier.price,
              }
            : {},
        };
      }

      updates[noticePath + "/" + noticeId] = {
        type: "order",
        urlItem: "/dashboard/orders/" + newOrderId,
        title: "New order is placed",
        content: "",
        items,
        createdAt: new Date().toISOString(),
      };
      updates[paymentInfoPath] = {
        ...data.paymentInfo,
      };


      socketRef.current?.emit("order:user-create", {
        ...data,
        id: newOrderId,
      });
      return await update(ref(db), updates);
    },
    onSuccess: (data, vars) => {
      toast.success("Placed OK!");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allOrders"],
      });
    },
    onError: (err) => {
      console.error("Err when plac order", err);
      toast.error("Err when plac order: " + err.message, {});
    },
  });

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL + "/orders");
    socketRef.current.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <Button
      className="flex-1"
      onClick={() => {
        handlePlaceOrder();
      }}
    >
      <CiDesktopMouse2 />
      <span>Place Order</span>
    </Button>
  );
};

export default PlaceOrderButton;
