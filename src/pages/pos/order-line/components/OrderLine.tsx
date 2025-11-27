import { useRef } from "react";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query } from "firebase/database";
import { convertFirebaseArrayData } from "@/utils/helper";
import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import type { TOrderDocumentData } from "@/types/checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BsCopy } from "react-icons/bs";
import { toast } from "sonner";

const statusBgColorMap = {
  pending: "bg-[#FFE2DE]",
  "in-kitchen": "bg-[#FFE2DE]",
  ready: "bg-[#E8D4ED]",
};
const statusBadgeColorMap = {
  pending: "bg-[#D7470F]",
  "in-kitchen": "bg-[#0B605A]",
  ready: "bg-[#693290]",
};

const OrderLine = () => {
  const scrollXRef = useRef<HTMLDivElement>(null);
  const setOrderId = usePosOrderLineState((state) => state.setOrderId);
  const clear = usePosOrderLineState((state) => state.clear);
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: orders } = useQuery({
    queryKey: ["restaurants", restaurantId, "allOrders"],
    queryFn: async () => {
      const orderRef = orderFirebaseKey({ restaurantId }).rootRef();

      const orderQuery = query(
        orderRef,
        orderByChild("basicInfo/shippingMethod"),
        equalTo("Dine In")
      );
      const orders = await get(orderQuery);
      const allOrders = convertFirebaseArrayData<TOrderDocumentData>(
        orders.val()
      );
      return allOrders.filter(
        (order) => order.basicInfo?.orderStatus !== "completed"
      );
    },

    enabled: !!restaurantId,
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-start gap-1">
        <h1 className="text-2xl font-semibold mb-3">Order Line</h1>
        <Button
          className="rounded-full w-max h-max p-1!"
          onClick={() => clear()}
        >
          <Plus />
        </Button>
      </div>
      <div className=" overflow-x-auto hidden-scrollbar" ref={scrollXRef}>
        <div className="flex items-center gap-4">
          {orders?.map((o) => {
            return (
              <Card
                key={o.id}
                className={cn(
                  "basis-1/3 max-2xl:basis-1/2 max-xl:basis-full  shrink-0",
                  statusBgColorMap[
                    o.basicInfo.orderStatus as keyof typeof statusBgColorMap
                  ]
                )}
                onClick={() => {
                  setOrderId(o.id);
                }}
              >
                <CardContent className="space-y-4">
                  <CardHeader className="text-sm p-0 flex max-md:flex-col max-md:justify-start justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        Order: {o.id.slice(0, 3) + "..." + o.id.slice(-3)}
                      </CardTitle>
                      <BsCopy
                        onClick={() => {
                          handleCopy(o.id);
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      Table {o.basicInfo.dineIn.tableNumber}
                    </span>
                  </CardHeader>

                  <strong>Item: {Object.keys(o.cartItems).length}X</strong>

                  <div className="flex items-center mt-2 justify-between">
                    <span className="text-sm font-semibold">
                      {formatDistanceToNow(new Date(o.basicInfo.createdAt))}
                    </span>
                    <span
                      className={cn(
                        "text-white text-xs rounded-full px-2 py-0.5 capitalize",
                        statusBadgeColorMap[
                          o.basicInfo
                            .orderStatus as keyof typeof statusBadgeColorMap
                        ]
                      )}
                    >
                      {o.basicInfo.orderStatus}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderLine;
