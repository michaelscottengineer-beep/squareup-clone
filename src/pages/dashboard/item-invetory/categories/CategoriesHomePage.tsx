import CreateCategoryDialog from "./components/CreateCategoryDialog";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, convertSegmentToQueryKey, parseSegments } from "@/utils/helper";
import type { TCategory } from "@/types/category";

import { Outlet } from "react-router";
import { DataTable } from "@/components/ui/data-table";
import { categoryColumn } from "./categoryColumn";
import EmptyCategory from "./components/EmptyCategory";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";

const CategoriesHomePage = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId});

  const { data: categories, isLoading } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allGroups()),
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        keys.allGroups()
      );
      const categories = await get(categoriesRef);
      return convertFirebaseArrayData<TCategory>(categories.val());
    },
    enabled: !!restaurantId,
  });

  return (
    <div className="px-2">
      <div>
        <h1 className="text-2xl font-bold mb-4 ">Categories</h1>
        {!categories?.length && !isLoading && <EmptyCategory />}
        {categories && (
          <div className="flex justify-between items-end">
            {categories?.length && (
              <div className="w-full flex justify-end">
                <CreateCategoryDialog />
              </div>
            )}
          </div>
        )}

        <div className="mt-4 space-y-4">
          <DataTable columns={categoryColumn} data={categories ?? []} />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default CategoriesHomePage;
