import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import { cn } from "@/lib/utils";
import type { TItem } from "@/types/item";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const CategoryItem = ({ item }: { item: TItem }) => {
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const addItem = usePosOrderLineState((state) => state.add);
  const removeItem = usePosOrderLineState((state) => state.remove);

  const handleAdd = () => {
    addItem({
      ...item,
      amount: 1,
      note: "",
    });
  };

  const handleRemove = () => {
    removeItem({
      ...item,
      amount: 1,
      note: "",
    });
  };

  const count = selectedItems?.[item.id]?.amount || 0;

  return (
    <div
      key={item.id}
      className={cn("rounded-md border-2 border-border", {
        "border-primary": count,
      })}
    >
      <div
        className={cn("p-0.5 rounded-xs", {
          "p-1": !!count,
        })}
      >
        <div className="bg-gray-100/80 rounded-md flex items-center justify-center py-4">
          <img src={item.image} className=" w-1/3 rounded-md aspect-square" />
        </div>
      </div>
      <div className="p-2 flex flex-col gap-4">
        <div className="font-medium text-sm capitalize">{item.name}</div>

        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">
            ${Number(item.price).toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={"secondary"}
              className="rounded-full p-1! h-max w-max bg-gray-100 text-gray-700 hover:text-gray-100"
              onClick={handleRemove}
              disabled={count === 0}
            >
              <Minus className="w-3! h-3!" />
            </Button>
            <div className="font-medium text-xs">{count}</div>
            <Button
              className="rounded-full p-1! h-max w-max"
              onClick={handleAdd}
            >
              <Plus className="w-3! h-3!" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CategoryItem;