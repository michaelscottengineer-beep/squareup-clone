
import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import { LuSoup } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { TCategory } from "@/types/category";

interface CategoryListItemProps {
  category: TCategory;
  onValueChange?: (category: TCategory) => void;
}


const CategoryListItem = ({ category }: CategoryListItemProps) => {
  const curId = usePosOrderLineState((state) => state.currentCategoryId);
  const setCategoryId = usePosOrderLineState(
    (state) => state.setCurrentCategoryId
  );

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border-2 cursor-pointer",
        {
          " border-primary": category.id === curId,
          " border-gray-200 ": category.id !== curId,
        }
      )}
      onClick={() => setCategoryId(category.id)}
    >
      <div className="bg-gray-100 rounded-md p-2 h-full aspect-square">
        <LuSoup />
      </div>
      <div className="flex  flex-col">
        <span className="font-medium text-sm">{category.basicInfo.name}</span>
        <span className="text-gray-500 text-xs">
          {Object.keys(category?.items ?? {}).length} Items
        </span>
      </div>
    </div>
  );
};


export default CategoryListItem;