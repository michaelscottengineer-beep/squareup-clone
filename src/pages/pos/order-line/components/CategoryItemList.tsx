
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import {
  get,
  ref,
} from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TCategoryDocumentData } from "@/types/category";
import usePosOrderLineState from "@/stores/use-pos-order-line-state";

import type { TItem } from "@/types/item";
import CategoryItem from "./CategoryItem";
import { Soup } from "lucide-react";

const CategoryItemList = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const curId = usePosOrderLineState((state) => state.currentCategoryId);

  const { data: category } = useQuery({
    queryKey: ["restaurants", restaurantId, "allGroups", curId],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups", curId)
      );

      const categories = await get(categoriesRef);
      return categories.val() as TCategoryDocumentData;
    },

    enabled: !!restaurantId && !!curId,
  });

  const items = convertFirebaseArrayData<TItem>(category?.items ?? {});

  if (items.length === 0) {
    return <div className="flex items-center justify-center mt-auto flex-col gap-4 ">
      <Soup size={40} className="text-primary" /> 
      <span className="text-xl">Empty</span>
      <span className="text-muted-foreground">This category does not exists any items</span>
      </div>
  }
  return (
    <div className="grid grid-cols-4 max-xl:grid-cols-2 max-lg:grid-cols-1 gap-4">
      {items?.map((item) => {
        return <CategoryItem key={item.id} item={item} />;
      })}
    </div>
  );
};

export default CategoryItemList;