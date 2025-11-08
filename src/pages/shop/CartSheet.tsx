import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RiShoppingCartLine } from "react-icons/ri";
import useCart from "@/stores/use-cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftFromLine, ArrowLeftIcon, Plus, X } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { TCartItem } from "@/types/item";
import CreationCartItemDialog from "./CreationCartItemDialog";
import CheckoutSheet from "./CheckoutSheet";
import { calcItemPrice } from "@/utils/helper";

const CartSheet = () => {
  const items = useCart((state) => state.items);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"}>
          <RiShoppingCartLine /> {items.length}
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader className="flex items-center flex-row border border-border">
          <SheetClose className="bg-muted p-1 rounded-md hover:shadow-sm  h-max w-max">
            <ArrowLeftIcon className="w-5 h-5" />
          </SheetClose>
          <SheetTitle className="text-center flex-1 text-xl font-semibold">
            Your Order
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-primary font-semibold text-xl">
              Test Restaurant [Production]
            </h2>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <div>75 5th Street NW, Atlanta, GA 30308</div>
            </div>
          </div>

          <div className="flex gap-4 flex-col">
            <CheckoutSheet />

            <Button variant={"outline"} className="rounded-full">
              <Plus /> Add More Items
            </Button>
          </div>

          <div>
            {items.map((item) => {
              return <CartItemCard key={item.id} item={item} />;
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface CartItemCardProps {
  item: TCartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const discountText =
    item.discount?.unit === "%"
      ? `${item.discount.value}% discount applied`
      : `$${item.discount?.value} discount applied`;

  return (
    <div className="space-y-2">
      <div className="w-max h-max p-1 flex items-center bg-secondary text-secondary-foreground rounded-full text-xs aspect-square shadow-lg">
        {item.amount} <X className="h-3 w-3" />
      </div>

      <div className="flex items-center justify-between">
        <span className="capitalize">{item.discount && item.name}</span>
        <span className="text-sm text-muted-foreground">
          ${calcItemPrice(Number(item.price), item.amount, item.discount)}
        </span>
      </div>
      <div className="promotion">
        <div className="text-green-600">{discountText}</div>
        <div className="text-green-600">10% promotion</div>
      </div>
      <div className="topping">
        <h4>Topping Specific</h4>
      </div>
      {item.note && (
        <div className="note">
          <h4>Note:</h4>
          <p>{item.note}</p>
        </div>
      )}
      <div className="notice text-muted-foreground">
        If sold out, Chef recommendation
      </div>
      <div className="actions flex items-center gap-4">
        <Button className="text-blue-500 p-0" variant={"link"}>
          Edit
        </Button>
        <CreationCartItemDialog
          item={item}
          onOpenChange={setIsOpenEdit}
          isOpen={isOpenEdit}
          isShowDialogOnly
        />
        <Button
          className="text-destructive p-0"
          variant={"link"}
          onClick={() => {
            useCart.getState().remove(item);
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
export default CartSheet;
