import CategoriesMultiSelection from "./CategoriesMultiSelection";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";
import {  Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoriesSection = () => {
  const categories = useItemCreationFormData((state) => state.categories);
  return (
    <div className="border rounded-xl p-4">
      <h1 className="font-semibold text-xl mb-4">Categories</h1>

      <CategoriesMultiSelection />
      <div className="mt-4">
        {categories.map((cate) => {
          return (
            <div
              key={cate.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="w-max h-max p-2 bg-muted rounded-md">
                  <Folder className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-2 line-clamp-1 flex-1">
                  <div className="font-medium"> {cate.basicInfo.name}</div>
                  <div className="bg-muted px-2 rounded-full flex-1 text-muted-foreground font-medium text-xs py-1">
                    Reporting
                  </div>
                </div>
              </div>
              <Button
                variant={"ghost"}
                size={"icon-sm"}
                className="rounded-full"
                onClick={() =>
                  useItemCreationFormData
                    .getState()
                    .setCategories(
                      categories.filter(
                        (selectedCate) => selectedCate.id !== cate.id
                      )
                    )
                }
              >
                <Trash2 className="text-destructive w-5 h-5 cursor-pointer" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
