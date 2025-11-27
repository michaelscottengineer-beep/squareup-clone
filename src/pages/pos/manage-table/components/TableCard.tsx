import tableFirebaseKey from "@/factory/table/table.firebaseKey";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TRestaurantTable } from "@/types/restaurant";
import { convertFirebaseArrayData } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get } from "firebase/database";
import { Users } from "lucide-react";
import React from "react";
import { PiChairLight } from "react-icons/pi";
import RestaurantChair from "./RestaurantChair";

const TableCard = ({ table }: { table: TRestaurantTable }) => {
  const status = table.status;
  const TOP_BOT_LENGTH = (table.basicInfo.maxPeople - 2) / 2;

  const bookedAt = status?.bookedAt;
  if (bookedAt) {
    const bookedDate = new Date(bookedAt);
    const now = new Date();
    const diffInMs = now.getTime() - bookedDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    if (diffInMinutes) {
      status.tableStatus = "on dine";
    }
    // You can use diffInMinutes if needed
  }
  const numberOfPeople = status?.numberOfPeople || 0;
  return (
    <div className="middle flex items-center gap-4 overflow-y-auto hidden-scrollbar">
      <div className="chair">
        <RestaurantChair status={status?.tableStatus} className={cn({})} />
      </div>
      <div className="flex flex-col gap-4 w-full  ">
        <div className="top flex items-center justify-around gap-4">
          {Array.from({ length: TOP_BOT_LENGTH }).map((_, idx) => (
            <RestaurantChair
              key={idx}
              status={status?.tableStatus}
              className={cn({
                "text-gray-500": numberOfPeople < idx + 1 + 1,
              })}
            />
          ))}
        </div>

        <div
          className={cn(
            " flex flex-col justify-center items-center gap-2 rounded-md py-4  w-full",
            {
              "table-on-dine": status?.tableStatus === "on dine",
              "table-available":
                status?.tableStatus === "available" || !status?.tableStatus,
              "table-reserved": status?.tableStatus === "reserved",
            }
          )}
        >
          <div>Table {table.basicInfo.name}</div>
          <div className="flex items-center gap-1">
            <Users className="size-4!" />
            <span>{status?.numberOfPeople || 0}</span>
          </div>
        </div>

        <div className="bottom flex items-center justify-around gap-4">
          {Array.from({ length: TOP_BOT_LENGTH }).map((_, idx) => (
            <RestaurantChair
              key={idx}
              status={status?.tableStatus}
              className={cn({
                "text-gray-500": numberOfPeople < idx + 1 + 2 + TOP_BOT_LENGTH,
              })}
            />
          ))}
        </div>
      </div>

      <div className="chair">
        <RestaurantChair
          status={status?.tableStatus}
          className={cn({
            "text-gray-500": numberOfPeople <= 1 + TOP_BOT_LENGTH,
          })}
        />
      </div>
    </div>
  );
};


export default TableCard;