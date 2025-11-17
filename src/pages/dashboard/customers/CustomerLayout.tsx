import { DataTable } from "@/components/ui/data-table";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import type { TOrderCartItem, TOrderDocumentData } from "@/types/checkout";
import { customerColumns } from "./customer-column";
import useAuth from "@/hooks/use-auth";
import type { TRestaurantCustomer } from "@/types/restaurant";
import type { TUser } from "@/types/user";

const CustomerLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const { user } = useAuth();

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allCustomers"],
    queryFn: async () => {
      try {
        const path = parseSegments("restaurants", restaurantId, "allCustomers");

        const customerRef = ref(db, path);

        const snap = await get(customerRef);

        const data = snap.val()
          ? convertFirebaseArrayData<TRestaurantCustomer>(snap.val())
          : [];

        const promise = data.map(async (item) => {
          const userDoc = await get(ref(db, parseSegments("users", item.id)));
          const userInfo = userDoc.val() as TUser | null;

          return {
            ...item,
            basicInfo: {
              ...item.basicInfo,
              fullName: userInfo?.displayName ?? "Unknown",
              email: userInfo?.email || "Unknown",
            },
          };
        });
        return await Promise.all(promise);
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  console.log("orders", items);
  return (
    <div className="px-2 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-4 max-w-[300px]">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                className="rounded-full"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* <Select
            defaultValue="all"
            onValueChange={(val) => setShippingMethod(val)}
          >
            <SelectTrigger>
              Type <span className="font-semibold">{shippingMethod}</span>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Dine In">Dine In</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="flex items-center gap-2  mb-3">
          {/* <QuickCreationDialog /> */}
        </div>
      </div>

      {!items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable columns={customerColumns} data={items} />
      )}
    </div>
  );
};

export default CustomerLayout;
