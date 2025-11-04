import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TItem } from "@/types/item";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { type ReactNode, useState } from "react";

import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {  Minus, Plus, X } from "lucide-react";
import useCart from "@/stores/use-cart";
import type { TModifierListItem } from "@/types/modifier";
import { toast } from "sonner";
import QuickCreate from "./QuickCreate";

interface CreationCartItemDialogProps {
  triggerButton?: ReactNode;
  item: TItem;
  isOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  isShowDialogOnly?: boolean;
}
const CreationCartItemDialog = ({
  triggerButton,
  item,
  onOpenChange,
  isOpen,
  isShowDialogOnly,
}: CreationCartItemDialogProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [selectedModifier, setSelectedModifier] =
    useState<TModifierListItem | null>(null);

  const { data: curItem, isLoading } = useQuery({
    queryKey: ["allItems", item.id],
    queryFn: async () => {
      const path = parseSegments(
        "restaurants",
        restaurantId,
        "allItems",
        item.id
      );

      const itemsRef = ref(db, path);
      const snap = await get(itemsRef);

      return snap.val() as TItem;
    },
    enabled: !!restaurantId,
  });

  console.log("zz", curItem?.modifiers?.[0].list);

  if (!isShowDialogOnly && !curItem?.modifiers?.length && isOpen) {
    return (
      <QuickCreate item={item} onClickCallback={() => onOpenChange?.(false)} />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="max-w-screen! rounded-none h-screen p-0">
        <div className="grid grid-cols-4">
          <div className="border-r border-border">
            <img src="/tmp_restaurant_img.jpeg" alt="dish-img" />

            <div className="px-5">
              <p className="ml-5 text-muted-foreground text-sm mt-8 mb-10">
                * Image shown is for illustration purposes only
              </p>

              <div className="px-5 space-y-4">
                <h1 className="capitalize font-semibold text-2xl">
                  {item.name}
                </h1>
                <div className="bg-accent-promo w-max h-max text-xs text-accent-promo-foreground rounded-full p-1">
                  10% OFF
                </div>

                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </div>
          <div className="topping_options col-span-3 py-10 flex flex-col items-center">
            <div className="max-w-[500px] w-full">
              <div className="font-semibold flex items-center justify-between border-b pb-2 border-border modifier_header">
                <div>Food Toppings</div>
                <div className="text-primary uppercase">Required</div>
              </div>

              <div className="cta_heading mt-4 font-semibold text-black/70">
                Choose one option
              </div>

              <RadioGroup
                className="w-full h-full"
                defaultValue={curItem?.modifiers?.[0].list?.[0].name}
                onValueChange={(c) => {
                  if (c) {
                    setSelectedModifier(
                      curItem?.modifiers?.[0].list?.find((m) => m.name === c) ??
                        null
                    );
                  }
                }}
              >
                {curItem?.modifiers?.[0].list?.map((modifier, i) => {
                  const key = "modifier-item-" + i;
                  return (
                    <Label
                      key={key}
                      htmlFor={key}
                      className="flex items-center gap-3 justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={modifier.name} id={key} />
                        <span>{modifier.name}</span>
                      </div>

                      <span className="text-muted-foreground text-sm font-normal">
                        ${modifier.price}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="w-full mt-auto">
              <ActionButtons
                item={curItem!}
                selectedModifier={selectedModifier}
                onSaveCallback={() => onOpenChange?.(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ActionButtonsProps {
  item: TItem;
  selectedModifier: TModifierListItem | null;
  onSaveCallback?: () => void
}

const ActionButtons = ({ item, selectedModifier, onSaveCallback }: ActionButtonsProps) => {
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
      modifiers: [...item.modifiers].map((m) => ({
        ...m,
        list: selectedModifier ? [selectedModifier] : [],
      })),
    });
    toast.success('Add new item to cart successfully')
    onSaveCallback?.();
  };

  const total = Number(item.price) * amount;
  const totalWithModifiers =
    total + (selectedModifier ? Number(selectedModifier.price) * amount : 0) 
  const totalWithPromotion =
    totalWithModifiers - (totalWithModifiers * 20) / 100;

  return (
    <div className="actions flex items-center gap-4 pt-4 justify-end px-10 border-t border-border">
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
        <div>Add Item</div>

        <div className="price flex items-center gap-2 ">
          <span className="text-muted/90">
            ${totalWithModifiers.toFixed(2)}
          </span>
          <span className="font-bold text-white">
            ${totalWithPromotion.toFixed(2)}
          </span>
        </div>
      </Button>
    </div>
  );
};
export default CreationCartItemDialog;
