import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import tableFirebaseKey from "@/factory/table/table.firebaseKey";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import type { TRestaurantTable } from "@/types/restaurant";
import { convertFirebaseArrayData } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { get } from "firebase/database";
import { CheckCircle, Phone, Plus, Users } from "lucide-react";
import React, { useMemo } from "react";
import { MdTableRestaurant } from "react-icons/md";
import { useNavigate } from "react-router";

const statusBgColors: Record<string, string> = {
  reserved: "bg-[#E9F4F5] text-[#0B605D]",
  onDine: "bg-[#FAE7E2]  text-[#D44A0C]",
  free: "bg-[#EDEFFE] text-gray-400",
};

const TableStatusList = ({ selectedTab }: { selectedTab: string }) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const setTableName = usePosOrderLineState(state => state.setTableNo);
  const navigate = useNavigate();

  const { data: tables } = useQuery({
    queryKey: ["restaurants", restaurantId, "pos", "allTables"],
    queryFn: async () => {
      const tablesRef = tableFirebaseKey({ restaurantId }).rootRef();
      const doc = await get(tablesRef);
      return convertFirebaseArrayData<TRestaurantTable>(doc.val() || {});
    },
    enabled: !!restaurantId,
  });
  console.log("tables", tables);

  const resolveHeaderText = (status?: TRestaurantTable["status"]) => {
    switch (status?.tableStatus) {
      case "on dine":
        return "On Dine";
      case "reserved":
        return formatDate(new Date(status.bookedAt), "hh:mm a");
      case "available":
        return "Free";
      default:
        return "Free";
    }
  };

  const resolveTitle = (status?: TRestaurantTable["status"]) => {
    switch (status?.tableStatus) {
      case "on dine":
        return "On Dine";
      case "reserved":
        return status.customerInfo?.name || "Reserved";
      case "available":
        return "Available Now";
      default:
        return "Available Now";
    }
  };

  const items = useMemo(() => {
    if (selectedTab === "All") return tables;
    return tables?.filter((table) => {
      const status = table.status;

      const bookedAt = status?.bookedAt;
      if (bookedAt) {
        const bookedDate = new Date(bookedAt);
        const now = new Date();
        const diffInMs = now.getTime() - bookedDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);
        if (diffInMinutes > 0) {
          status.tableStatus = "on dine";
        }
        // You can use diffInMinutes if needed
      }

      if (selectedTab === "Reservation") {
        return status?.tableStatus === "reserved";
      } else if (selectedTab === "On Dine") {
        return status?.tableStatus === "on dine";
      }

      return (
        status?.tableStatus === "available" || status?.tableStatus === undefined
      );
    });
  }, [selectedTab, tables]);

  return (
    <div className="gap-4 flex flex-col mt-4 overflow-y-auto max-h-[600px] flex-1">
      {!items?.length && <div>No items found.</div>}
      {items?.map((table) => {
        const status = table.status;

        const bookedAt = status?.bookedAt;
        if (bookedAt) {
          const bookedDate = new Date(bookedAt);
          const now = new Date();
          const diffInMs = now.getTime() - bookedDate.getTime();
          const diffInMinutes = Math.floor(diffInMs / 60000);
          if (diffInMinutes > 0) {
            status.tableStatus = "on dine";
          }
          // You can use diffInMinutes if needed
        }

        return (
          <Card
            key={table.id}
            className="flex items-center gap-2 flex-row h-full basis-[100px] shrink-0 py-2 px-2  "
          >
            <div
              className={cn(
                "text-pretty font-medium w-full max-w-16 p-1  rounded-md flex  justify-center items-center h-full text-center",
                {
                  "table-on-dine": status?.tableStatus === "on dine",
                  "table-available":
                    status?.tableStatus === "available" ||
                    status?.tableStatus === undefined,
                  "table-reserved": status?.tableStatus === "reserved",
                }
              )}
            >
              {resolveHeaderText(status)}
            </div>

            <CardContent className="space-y-2 flex-1">
              <CardTitle>{resolveTitle(status)}</CardTitle>

              <div className="flex items-center gap-2">
                <div className="flex text-sm items-center gap-1">
                  <MdTableRestaurant className="size-3!" />
                  <span>{table.basicInfo.name}</span>
                </div>
                <div className="flex text-sm  items-center gap-1">
                  <Users className="size-3!" />
                  <span>{status?.numberOfPeople || 0}</span>
                </div>
              </div>
              {status?.customerInfo?.phone && (
                <div className="flex text-sm items-center gap-1">
                  <Phone className="size-3!" />
                  <span>{status.customerInfo?.phone}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <CheckCircle
                  className={cn("size-3!", {
                    "text-green-500": status?.paymentStatus === "paid",
                  })}
                />
                <span className="text-xs capitalize font-medium">
                  {status?.paymentStatus ?? "UnPaid"}
                </span>
              </div>
              {status?.customerInfo?.name && (
                <Button className="flex items-center text-xs" size={"sm"} onClick={() => {
                  setTableName(table.basicInfo.name);
                  navigate("/pos/order-line");
                }}>
                  <Plus className="size-3!" />
                  Order
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default TableStatusList;
