import React from "react";
import CategoriesMultiSelection from "./CategoriesMultiSelection";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";
import { Delete, Folder } from "lucide-react";

const CategoriesSection = () => {
  const categories = useItemCreationFormData((state) => state.categories);
  return (
    <div className="border rounded-xl p-4">
      <h1 className="font-semibold text-xl mb-4">Categories</h1>

      <CategoriesMultiSelection />
      <div className="mt-4">
        {categories.map((cate) => {
          return (
            <div key={cate.id} className="flex items-center gap-2">
              <div className="flex items-center justify-between gap-4">
                <div className="w-max h-max p-2 bg-muted rounded-md">
                  <Folder  />
                </div>

                <div className="flex items-center gap-2 line-clamp-1 flex-1">
                  {cate.basicInfo.name}
                  <div className="bg-muted px-2 rounded-full flex-1">Reporting</div>
                </div>
              </div>
              <Delete
              className="text-red-500 cursor-pointer"
                onClick={() =>
                  useItemCreationFormData
                    .getState()
                    .setCategories(
                      categories.filter(
                        (selectedCate) => selectedCate.id !== cate.id
                      )
                    )
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
