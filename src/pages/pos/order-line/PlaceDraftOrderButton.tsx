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
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { push, ref, update } from "firebase/database";
import { CiDesktopMouse2 } from "react-icons/ci";
import { RiSaveLine } from "react-icons/ri";
import { toast } from "sonner";

const PlaceDraftOrderButton = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const tableNumber = usePosOrderLineState((state) => state.tableNo);
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const clearForm = usePosOrderLineState((state) => state.clear);
  const { user } = useAuth();
  const subTotal = usePosOrderLineSubtotal();
  const queryClient = useQueryClient();

  const { mutate: handlePlaceOrder } = useMutation({
    mutationFn: async () => {
      if (!tableNumber) {
        throw new Error("Please Enter the Table No!");
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

      console.log("incoming updates", updates);

      console.log(data);

      return await update(ref(db), updates);
    },
    onSuccess: (data, vars) => {
      toast.success("Placed OK!");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allOrders"],
      });
      clearForm();
    },
    onError: (err) => {
      console.error("Err when plac order", err);
      toast.error("Error when placed order: " + err.message);
    },
  });

  return (
    <Button
      className="bg-yellow-500/80"
      onClick={() => {
        handlePlaceOrder();
      }}
    >
      <RiSaveLine />
      <span>Draft</span>
    </Button>
  );
};

export default PlaceDraftOrderButton;
