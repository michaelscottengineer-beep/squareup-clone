import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { TOrderCartItem, TOrderDocumentData } from "@/types/checkout";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "@/firebase";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { orderColumns } from "./orderColumns";

const ViewOrderSheet = ({ customerId }: { customerId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View Orders</DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="w-max max-w-max!">
        {customerId && <OrderLayout customerId={customerId} />}
      </SheetContent>
    </Sheet>
  );
};

const OrderLayout = ({ customerId }: { customerId: string }) => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [shippingMethod, setShippingMethod] = useState("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["allOrders", "of-customer", customerId],
    queryFn: async () => {
      try {
        const path = parseSegments("restaurants", restaurantId, "allOrders");

        const ordersRef = ref(db, path);
        let qr = null;
        qr = query(
          ordersRef,
          orderByChild("basicInfo/createdBy"),
          equalTo(customerId)
        );

        const snap = await get(qr ?? ordersRef);

        return snap.val()
          ? convertFirebaseArrayData<TOrderDocumentData>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  console.log("orders", items);
  return (
    <div className="px-2 space-y-4  mt-10">
   
      {!items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable
          columns={orderColumns}
          data={items.map((r) => ({
            ...r,
            cartItems: convertFirebaseArrayData<TOrderCartItem>(
              r?.cartItems ?? {}
            ),
          }))}
        />
      )}
    </div>
  );
};

export default ViewOrderSheet;
