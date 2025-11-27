import { useRef } from "react";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TCategory } from "@/types/category";
import usePosOrderLineState from "@/stores/use-pos-order-line-state";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import DashedHr from "@/components/ui/dashed-hr";
import CategoryListItem from "./CategoryListItem";
import CategoryItemList from "./CategoryItemList";

const CategoryList = () => {
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const setCategoryId = usePosOrderLineState(
    (state) => state.setCurrentCategoryId
  );

  const { data: categories } = useQuery({
    queryKey: ["restaurants", restaurantId, "allGroups"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups")
      );

      const categories = await get(categoriesRef);
      return convertFirebaseArrayData<TCategory>(categories.val());
    },
    select: (data) => {
      if (data.length) {
        setCategoryId(data[0].id);
      }
      return data;
    },
    enabled: !!restaurantId,
  });

  if (!categories) return "no";
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-semibold text-2xl ">Food Categories</h1>
        <ButtonGroup>
          <Button
            className="bg-transparent hover:bg-transparent text-primary"
            onClick={() => {
              categoriesScrollRef.current?.scrollBy({
                behavior: "smooth",
                left: -200,
                top: 0,
              });
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            className="bg-transparent hover:bg-transparent text-primary"
            onClick={() => {
              categoriesScrollRef.current?.scrollBy({
                behavior: "smooth",
                left: 200,
                top: 0,
              });
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      </div>
      <div
        className=" overflow-x-auto hidden-scrollbar"
        ref={categoriesScrollRef}
      >
        <div className="flex items-center gap-4 w-max">
          {[...categories, ...categories, ...categories]?.map((cate) => {
            return <CategoryListItem category={cate} />;
          })}
        </div>
      </div>

      <DashedHr className="my-8" />

      <CategoryItemList />
    </div>
  );
};

export default CategoryList;
