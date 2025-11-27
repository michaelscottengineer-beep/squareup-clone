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
import TableCard from "./components/TableCard";


const TableView = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: tables } = useQuery({
    queryKey: ["restaurants", restaurantId, "pos", "allTables"],
    queryFn: async () => {
      const tablesRef = tableFirebaseKey({ restaurantId }).rootRef();
      const doc = await get(tablesRef);
      return convertFirebaseArrayData<TRestaurantTable>(doc.val() || {});
    },
    enabled: !!restaurantId,
  });

  if (!tables) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 bg-white  ">
      {tables?.length === 0 && <div>No tables found.</div>}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 overflow-y-scroll gap-x-8   max-h-[calc(100vh-var(--pos-header-height)-2rem)] hidden-scrollbar">
        {[...tables, ...tables]?.map((table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
};


export default TableView;
