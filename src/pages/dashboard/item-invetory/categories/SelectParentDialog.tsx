"use client";

import { Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TCategory } from "@/types/category";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import type { RadioGroupItemProps } from "@radix-ui/react-radio-group";
import { useEffect, useState } from "react";

const SelectParentCategoryDialog = ({
  defaultValue = "",
  onChange,
}: {
  defaultValue?: string;
  onChange?: (cateId: string) => void;
}) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [selectedCateId, setSelectedCateId] = useState(defaultValue);
  useEffect(() => {
    setSelectedCateId(defaultValue);
  }, [defaultValue]);

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

  console.log(categories);
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 items-center">
          <Settings2 className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Parent category</h3>
            <p className="text-sm text-muted-foreground">
              {selectedCateId !== ""
                ? selectedCateId
                : "Select a parent category to make this a subcategory."}
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="h-auto p-0 font-medium">
              Select
            </Button>
          </DialogTrigger>
          <DialogContent className="" showCloseButton={false}>
            <DialogHeader className="flex items-center justify-between flex-row">
              <DialogClose className="">
                <Button variant={"secondary"} className="rounded-full">
                  <X />
                </Button>
              </DialogClose>
              <Button
                className="rounded-full px-5 py-3 w-max"
                onClick={() => {
                  console.log("change selectedCateiD", selectedCateId);
                  onChange?.(selectedCateId);
                }}
              >
                Done
              </Button>
            </DialogHeader>

            {/* Main heading */}
            <h1 className="text-2xl font-bold ">Parent category</h1>

            {/* Description text with learn more link */}
            <p className="text-sm text-muted-foreground mb-8">
              Select a parent category to nest this category underneath it.
            </p>

            <RadioGroup onValueChange={setSelectedCateId}>
              {[undefined, ...(categories ?? [])]?.map((cate, i) => {
                return (
                  <OptionCategory
                    value={cate?.id ?? ""}
                    defaultChecked={selectedCateId === (cate?.id ?? "")}
                    category={cate}
                    key={cate?.id ?? ""}
                  />
                );
              })}
            </RadioGroup>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const OptionCategory = ({
  category,
  ...props
}: {
  category?: TCategory;
} & RadioGroupItemProps) => {
  const cateId = category?.id ?? "0";
  const name = category?.basicInfo.name ?? "None";
  return (
    <>
      <Label
        htmlFor={cateId}
        className="flex items-center justify-between gap-3 w-full cursor-pointer  px-5 py-2"
      >
        <div className="flex items-center gap-2">
          <div className="bg-red-500 w-5 h-5 rounded-full"></div>
          <div>{name}</div>
        </div>
        <RadioGroupItem {...props} id={cateId} />
      </Label>
      <hr />
    </>
  );
};

export default SelectParentCategoryDialog;
