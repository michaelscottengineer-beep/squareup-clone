import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import CategorySection from "./CategorySection";
import Header from "./Header";
import IntroduceSection from "./IntroduceSection";
import ListCategory from "./ListCategory";
import "./ShopLayout.css";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type {
  TCategory,
  TCategoryDocumentData,
  TCategoryV2,
} from "@/types/category";
import type { TItem } from "@/types/item";
import useCart from "@/stores/use-cart";

const ShopLayout = () => {
  return (
    <div className="relative">
      <Header />

      <main className="">
        <IntroduceSection />

        <DishSection />

      </main>
    </div>
  );
};

const DishSection = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups")
      );

      const categories = await get(categoriesRef);
      const val = categories.val() as TCategoryDocumentData;

      return val ? convertFirebaseArrayData<TCategoryV2>(categories.val()) : [];
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    console.log("check", useCart.getState().items);
  }, []);

  return (
    <>
      <div className="w-full border-t border-b border-border py-5 sticky top-[61px] bg-white z-10">
        <ListCategory categories={categories ?? []} />
      </div>

      <div className="shop-container mb-10">
        {categories?.map((cate) => {
          return (
            <CategorySection
              key={cate.id}
              items={convertFirebaseArrayData<TItem>(cate.items ?? {})}
              categoryName={cate.basicInfo.name}
            />
          );
        })}
      </div>
    </>
  );
};
export default ShopLayout;
