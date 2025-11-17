import { DataTable } from "@/components/ui/data-table";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  endAt,
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
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

import { orderHistoryColumns } from "./orderHistoryColumn";
import type { TOrderHistoryDocumentData } from "@/types/order";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    keyword: "",
    orderStatus: "",
  });
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [orderStatus, setOrderStatus] = useState("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["allOrdersHistory", orderStatus, filter],
    queryFn: async () => {
      try {
        const path = parseSegments(
          "restaurants",
          restaurantId,
          "allOrdersHistory"
        );

        const ordersRef = ref(db, path);
        let qr = null;
        if (filter.keyword) {
          qr = query(
            ordersRef,
            orderByChild("basicInfo/orderId"),
            startAt(filter.keyword),
            endAt(filter.keyword + "\uf8ff")
          );
        }

        const snap = await get(qr ? qr : ordersRef);

        return snap.val()
          ? convertFirebaseArrayData<TOrderHistoryDocumentData>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  return (
    <div className="px-2 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-4 max-w-[300px]">
            <InputGroup>
              <InputGroupInput
                autoFocus
                placeholder="Search..."
                className="rounded-full"
                value={filter.keyword}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    keyword: e.target.value,
                  }));
                }}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Select
            defaultValue="all"
            onValueChange={(val) => setOrderStatus(val)}
          >
            <SelectTrigger>
              Type <span className="font-semibold">{orderStatus}</span>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Dine In">Dine In</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2  mb-3">
          {/* <QuickCreationDialog /> */}
        </div>
      </div>

      {isLoading ? (
        <div>Loading items...</div>
      ) : !items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable columns={orderHistoryColumns} data={items} />
      )}
    </div>
  );
};

export default OrderHistory;
