import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import tableFirebaseKey from "@/factory/table/table.firebaseKey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import usePosOrderLineState, {
  usePosOrderLineSubtotal,
} from "@/stores/use-pos-order-line-state";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { query, ref, remove, update } from "firebase/database";
import { Check } from "lucide-react";
import React, { useEffect } from "react";
import { BiMoney } from "react-icons/bi";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

const PaidButton = () => {
  const socketRef = React.useRef<Socket | null>(null);
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const tableNo = usePosOrderLineState((state) => state.tableNo);
  const paymentMethod = usePosOrderLineState((state) => state.paymentMethod);
  const clear = usePosOrderLineState((state) => state.clear);
  const subTotal = usePosOrderLineSubtotal();
  const orderId = usePosOrderLineState((state) => state.orderId);
  const [isCustomerConfirm, setIsCustomerConfirm] = React.useState(false);
  const queryClient = useQueryClient();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const mutation = useMutation({
    mutationFn: async () => {
      const orderPath = orderFirebaseKey({ restaurantId, orderId }).details();
      const updates: { [key: string]: any } = {};
      updates[`${orderPath}/basicInfo/orderStatus`] = "completed";
      const tablePath = tableFirebaseKey({
        restaurantId,
        tableId: tableNo,
      }).details();

      remove(ref(db, parseSegments(tablePath, "status")));

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Order completed successfully");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "pos", "allTables"],
      });
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allOrders"],
      });
      clear();
    },
    onError: (error) => {
      toast.error("Failed to complete the order: " + error.message);
    },
  });
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL + "/invoice-preview");
    socketRef.current.connect();

    socketRef.current.on("invoice:customer-confirmed", (isConfirmed) => {
      console.log("Customer confirmation data:", isConfirmed);
      setIsCustomerConfirm(!!isConfirmed);
    });

    return () => {
      // Clean up on unmount
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="col-span-2"
          onClick={() => {
            socketRef.current?.emit("invoice:preview", {
              selectedItems,
              tableNo,
              subTotal,
              paymentMethod,
              orderId,
            });
          }}
        >
          <BiMoney />
          Paid
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col ">
        <h1>Order Invoice Preview</h1>

        <div>
          <div className="flex items-center justify-between">
            <span>Table: {tableNo}</span>
            <span>Order: {orderId}</span>
          </div>

          <div className="flex flex-col gap-2">
            {Object.values(selectedItems).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span>
                  {item.name} x {item.amount}
                </span>
                <span>
                  ${((Number(item.price) || 0) * item.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div className="">PaymentMethod: {paymentMethod}</div>
          </div>
        </div>
        {isCustomerConfirm && (
          <Button
            onClick={() => {
              mutation.mutate();
            }}
          >
            <Check /> Complete
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaidButton;
