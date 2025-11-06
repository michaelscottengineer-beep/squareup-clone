import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftIcon } from "lucide-react";


import CheckoutSheetContent from "./CheckoutSheetContent";
import { useCartTotal } from "@/stores/use-cart";


const CheckoutSheet = () => {
  const total = useCartTotal();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <div>
            <span>Checkout</span> <span>${total}</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="">
        <SheetHeader className="flex items-center flex-row border border-border">
          <SheetClose className="bg-muted p-1 rounded-md hover:shadow-sm  h-max w-max">
            <ArrowLeftIcon className="w-5 h-5" />
          </SheetClose>
          <SheetTitle className="text-center flex-1 text-xl font-semibold">
            Express Check Out
          </SheetTitle>
        </SheetHeader>

        <CheckoutSheetContent />
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutSheet;
