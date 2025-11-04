"use client";

import { Button } from "@/components/ui/button";

import type { TItem } from "@/types/item";
import { useState } from "react";

import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Check, Minus, Plus, X } from "lucide-react";
import useCart from "@/stores/use-cart";
import { toast } from "sonner";

interface QuickCreateProps {
  onClickCallback?: (type: "close" | "submit") => void;
  item: TItem;
}

const QuickCreate = ({ item, onClickCallback }: QuickCreateProps) => {
  const [amount, setAmount] = useState(1);
  const handleMinus = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  const handleAdd = () => {
    setAmount(amount + 1);
  };

  const handleSaveCartItem = () => {
    useCart.getState().add({
      ...item,
      amount,
      note: "",
    });
    toast.success("Add to cart successfully!");
    onClickCallback?.("submit");
  };

  const handleActionClick = () => {};

  return (
    <div className="absolute backdrop-blur-[1px] bg-white/30 z-20 w-full h-full justify-center flex items-center gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <ButtonGroup>
        <Button onClick={handleMinus} variant={"secondary"}>
          <Minus />
        </Button>
        <ButtonGroupText>{amount}</ButtonGroupText>
        <Button onClick={handleAdd} variant={"secondary"}>
          <Plus />
        </Button>
      </ButtonGroup>

      <Button
        className="hover:shadow-lg hover:shadow-primary/10"
        onClick={handleSaveCartItem}
      >
        <Check />
      </Button>
      <Button
        className="bg-white text-black border-black border hover:shadow-lg hover:bg-white"
        variant={"secondary"}
        onClick={() => {
          onClickCallback?.("close");
        }}
      >
        <X />
      </Button>
    </div>
  );
};

export default QuickCreate;
