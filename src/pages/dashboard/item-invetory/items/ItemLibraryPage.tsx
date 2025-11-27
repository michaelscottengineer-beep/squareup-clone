import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/table/ItemTable/columns";
import type { TItem } from "@/types/item";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import QuickCreationDialog from "./components/QuickCreationDialog";

const ItemLibraryPage = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allItems"],
    queryFn: async () => {
      const path = parseSegments("restaurants", restaurantId, "allItems");

      const itemsRef = ref(db, path);
      const snap = await get(itemsRef);

      return convertFirebaseArrayData<TItem>(snap.val());
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  return (
    <div className="px-2">
      <h1 className="text-xl font-bold">Items</h1>
      <div className="flex gap-2 items-end mb-4">
        <div className="flex items-center gap-2 ml-auto   flex-wrap">
          <QuickCreationDialog />
          <Button
            className="rounded-full px-5 py-3"
            onClick={() => navigate("/dashboard/items/library/new")}
          >
            Create item
          </Button>
        </div>
      </div>

      {!items?.length ? (
        <div>No items</div>
      ) : (
        <DataTable columns={columns} data={items} />
      )}
    </div>
  );
};

export default ItemLibraryPage;
