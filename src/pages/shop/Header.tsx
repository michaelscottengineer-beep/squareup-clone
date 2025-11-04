import React from "react";
import PromotionSheet from "./PromotionSheet";
import CartSheet from "./CartSheet";
import { Button } from "@/components/ui/button";
import { RiDiscountPercentLine } from "react-icons/ri";

const Header = () => {
  return (
    <div className="flex items-center bg-white z-10 shop-container justify-between py-3 px-5 sticky top-0 border-b border-border">
      <div>Heade1r</div>
      <div>Header</div>

      <div className="flex items-center gap-4">
        <PromotionSheet
          triggerButton={
            <Button variant={"secondary"}>
              <RiDiscountPercentLine />
              3
            </Button>
          }
        />
        <CartSheet />
      </div>
    </div>
  );
};

export default Header;
