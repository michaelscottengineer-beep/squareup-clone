import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OrderItemSection from "./OrderItemsSection";
import OrderSummary from "./OrderSummary";
import { useQuery } from "@tanstack/react-query";
import { parseSegments } from "@/utils/helper";
import { get, ref } from "firebase/database";
import type { TOrderDocumentData } from "@/types/checkout";
import { db } from "@/firebase";

const OrderDetailSheet = ({
  orderId,
  restaurantId,
}: {
  orderId: string;
  restaurantId: string;
}) => {
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

  if (isLoading) return <div>loading...</div>;

  if (!order) return <div>No Data</div>;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Details
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="font-medium">OrderId: {orderId}</div>
          <OrderItemSection order={order} />

          <OrderSummary order={order} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailSheet;
