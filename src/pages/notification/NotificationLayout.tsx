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
import { Link, useNavigate } from "react-router";

import type { TOrderCartItem, TOrderDocumentData } from "@/types/checkout";
import type { TNotification } from "@/types/notification";
import type { TCartItem } from "@/types/item";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

const NotificationLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["allNotifications"],
    queryFn: async () => {
      try {
        const path = parseSegments(
          "restaurants",
          restaurantId,
          "allNotifications"
        );

        const ordersRef = ref(db, path);
        const snap = await get(ordersRef);

        return snap.val()
          ? convertFirebaseArrayData<TNotification>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-8">Notifications</h1>

      <div className="space-y-6">
        {notifications?.map((notice) => {
          if (notice.type === "order") {
            const items = notice.items as TCartItem[];
            return (
              <Button
                asChild
                key={notice.id}
                variant={"ghost"}
                className="flex flex-col items-start h-max bg-background shadow-md"
              >
                <Link to={notice.urlItem}>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 h-max w-max p-3 rounded-md">
                      <HiMiniShoppingCart className="fill-yellow-500 h-5! w-5!" />
                    </div>
                    <div className="flex flex-col">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">
                            {notice.title}
                          </h4>
                          <div className="bg-gray-500 rounded-full w-1 h-1"></div>
                          <div className="text-gray-500">
                            {notice.createdAt
                              ? formatDistanceToNowStrict(
                                  new Date(notice.createdAt)
                                )
                              : ""}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          Ordered {items.length} Items
                        </p>
                      </div>
                      <div className="mt-4 space-y-4">
                        {items.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <img
                                src={item.image}
                                alt="food img"
                                className="w-10 h-10 rounded-md"
                              />
                              <div className="flex gap-1 flex-col">
                                <h5 className="font-semibold">{item.name}</h5>
                                <div className="text-gray-400 text-sm items-center flex gap-2 text-xs">
                                  <span> (Qty: {item.amount})</span>
                                  <span>
                                    <span className="text-accent-promo">
                                      ${item.price}
                                    </span>{" "}
                                    /each
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default NotificationLayout;
