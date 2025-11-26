import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import { restaurantTableColumns } from "./restaurantTableColumns";
import type { TRestaurantTable } from "@/types/restaurant";

import TableActionDialog from "./TableActionDialog";
import tableFirebaseKey from "@/factory/table/table.firebaseKey";

const TableManagement = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allTables"],
    queryFn: async () => {
      try {
        const path = tableFirebaseKey({ restaurantId }).root();
        const tablesRef = ref(db, path);

        const snap = await get(tablesRef);

        return snap.val()
          ? convertFirebaseArrayData<TRestaurantTable>(snap.val())
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

        <div className="flex items-center gap-2">
          <TableActionDialog trigger={<Button>Create new Table</Button>} />
        </div>
      </div>

      <DataTable columns={restaurantTableColumns} data={items ?? []} />
    </div>
  );
};

export default TableManagement;
