import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCategory } from "@/types/category";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";

const CategoriesMultiSelection = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const selectedItems = useItemCreationFormData(state => state.categories);
  const setSelectedItems = useItemCreationFormData(state => state.setCategories);
  
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups")
      );

      const categories = await get(categoriesRef);
      return convertFirebaseArrayData<TCategory>(categories.val());
    },
  });

  useEffect(() => {
    useItemCreationFormData.getState().setCategories(selectedItems);
  }, [selectedItems]);

  const handleSelectChange = (value: TCategory) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value]);
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
    }
  };
  const isOptionSelected = (value: TCategory): boolean => {
    return selectedItems.includes(value) ? true : false;
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <InputGroup>
            <InputGroupInput placeholder="Search..." className="rounded-full" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </DropdownMenuTrigger>

        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          {categories?.map((value: TCategory, index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                key={index}
                checked={isOptionSelected(value)}
                onCheckedChange={() => handleSelectChange(value)}
              >
                {value.basicInfo.name}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoriesMultiSelection;
