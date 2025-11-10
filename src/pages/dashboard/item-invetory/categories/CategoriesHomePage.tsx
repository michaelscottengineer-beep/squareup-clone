import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Folder, Menu, Search, X } from "lucide-react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TCategory } from "@/types/category";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, Outlet } from "react-router";

const CategoriesHomePage = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: categories } = useQuery({
    queryKey: ["allGroups", restaurantId],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups")
      );

      const categories = await get(categoriesRef);
      return convertFirebaseArrayData<TCategory>(categories.val());
    },
    enabled: !!restaurantId
  });

  return (
    <div className="px-10">
      {categories?.length && (
        <div className="w-full flex justify-end">
          <CreateCategoryDialog />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold mb-4 ">Categories</h1>
        {!categories?.length  && (
          <Card className="px-4 rounded-xl w-full">
            <CardContent className="text-center flex flex-col items-center space-y-4">
              <Folder className="w-20 h-20 text-gray-400" />
              <CardTitle>Item Categories</CardTitle>
              <CardDescription className="max-w-[500px]">
                Categories help organize your items, determine how customers
                navigate your Square Online site, report on item sales and route
                items to specific printers.
              </CardDescription>
              <CreateCategoryDialog />
            </CardContent>
          </Card>
        )}
        {categories && (
          <div className="flex justify-between items-center">
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

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any" className="cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">Any</span>
                      <span>Show all categories</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Menu />
            </div>
          </div>
        )}
       
       <div className="mt-4 space-y-4">

         {categories?.map((cate) => {
          return (
            <Link to={`/dashboard/items/categories/${cate.id}`} key={cate.id} className="flex items-center hover:bg-muted p-2 rounded-lg w-full gap-2">
              <Checkbox />
              <div>{cate.basicInfo.name}</div>
            </Link>
          );
        })}
       </div>
      </div>
      <Outlet />
    </div>
  );
};

export default CategoriesHomePage;
