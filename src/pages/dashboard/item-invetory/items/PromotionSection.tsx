import useItemCreationFormData from "@/stores/use-item-creation-form-data";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { TPromotion } from "@/types/promotion";
import PromotionSelector from "./PromotionSelector";
import { formatDate } from "date-fns";

const PromotionSection = () => {
  const promotions = useItemCreationFormData((state) => state.promotions);

  const handleRemove = (item: TPromotion) => {
    useItemCreationFormData
      .getState()
      .setPromotions(promotions.filter((m) => m.id !== item.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Promotions</h2>
          <p className="text-sm text-gray-600">
            Allow promotions for this item{" "}
            <a href="#" className="text-blue-600 underline">
              Learn more
            </a>
          </p>
        </div>

        <PromotionSelector />
      </div>

      <div className="mt-5">
        {promotions.map((m) => {
          return (
            <div key={m.id} className="flex items-center justify-between">
              <div className="gap-1 flex flex-col">
                <div className="font-semibold">{m.basicInfo.title}</div>
                <div className="text-gray-500 flex items-center gap-2">
                  <span>{m.basicInfo.discount}%</span>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span>
                    {formatDate(
                      new Date(m.basicInfo.schedule.date.from),
                      "dd/MM/yyyy"
                    )}{" "}
                    -{" "}
                    {formatDate(
                      new Date(m.basicInfo.schedule.date.to),
                      "dd/MM/yyyy"
                    )}
                  </span>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <span>
                    {m.basicInfo.schedule?.time?.from} -{" "}
                    {m.basicInfo.schedule?.time?.to}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleRemove(m)}
                variant={"ghost"}
                size={"icon"}
                className="rounded-full"
              >
                <Trash2 />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionSection;
