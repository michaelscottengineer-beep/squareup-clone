import React, { useState } from "react";
import PromotionForm from "./components/PromotionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, X } from "lucide-react";

const RestaurantPromotion = () => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-lg">List current Promotions</h2>
        <Button
          className={cn(
            "bg-yellow-100 hover:bg-yellow-100  hover:shadow-lg hover:shadow-yellow-100 h-max w-max p-1",
            {
              "bg-destructive/10 hover:bg-destructive/10 hover:shadow-lg hover:shadow-destructive/10":
                isEdit,
            }
          )}
          onClick={() => setIsEdit(!isEdit)}
        >
          {isEdit ? (
            <X className="h-4 w-4  text-destructive" />
          ) : (
            <Edit className="h-4 w-4  text-yellow-500" />
          )}
        </Button>
      </div>
      <PromotionForm isEdit={isEdit} />
    </div>
  );
};

export default RestaurantPromotion;
