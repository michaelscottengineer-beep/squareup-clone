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

import { permissionColumns } from "./permissionColumns";

import restaurantFirebaseKey from "@/factory/restaurant/restaurant.firebasekey";
import PermissionActionDialog from "./PermissionActionDialog";
import type { TPermission } from "@/types/permission";

const PermissionLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allPermissions"],
    queryFn: async () => {
      try {
        const path = restaurantFirebaseKey({ restaurantId }).permissions();
        const permissionRef = ref(db, path);

        const snap = await get(permissionRef);

        return snap.val()
          ? convertFirebaseArrayData<TPermission>(snap.val())
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
          <PermissionActionDialog
            trigger={<Button>Create new Permission</Button>}
          />
        </div>
      </div>

      <DataTable columns={permissionColumns} data={items ?? []} />
    </div>
  );
};

export default PermissionLayout;
