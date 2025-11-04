import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface QuickAddToCartButtonProps {
  onClickCallback?: () => void;
}

const QuickAddToCartButton = ({
  onClickCallback,
}: QuickAddToCartButtonProps) => {
  return (
    <div className="absolute -top-3 -right-1">
      <Button
        size={"icon-sm"}
        className="rounded-full"
        onClick={onClickCallback}
      >
        <Plus className="w-4! h-4!" />
      </Button>
    </div>
  );
};

export default QuickAddToCartButton;
