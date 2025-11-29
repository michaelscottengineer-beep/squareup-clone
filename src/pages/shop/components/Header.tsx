import React from "react";
import PromotionSheet from "./promotion/PromotionSheet";
import CartSheet from "./cart/CartSheet";
import { Button } from "@/components/ui/button";
import { RiDiscountPercentLine } from "react-icons/ri";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TPromotion } from "@/types/promotion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import { useNavigate, useParams } from "react-router";

const Header = () => {
  const {shopId: restaurantId} = useParams();
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["allPromotions"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allPromotions")
      );

      const categories = await get(categoriesRef);
      const val = categories.val() as TPromotion;

      return val ? convertFirebaseArrayData<TPromotion>(categories.val()) : [];
    },
    enabled: !!restaurantId,
  });

  return (
    <div className="border-b border-border h-20 flex sticky top-0 z-10 ">
      <div className="flex items-center flex-1 bg-white shop-container justify-between ">
        <div>Bar</div>
        <div>Nav</div>

        <div className="flex items-center gap-4">
          <PromotionSheet
            promotions={promotions ?? []}
            triggerButton={
              <Button variant={"secondary"}>
                <RiDiscountPercentLine />
                <span>{promotions?.length ?? 0}</span>
              </Button>
            }
          />
          <CartSheet />

          <AuthDropdown />
        </div>
      </div>
    </div>
  );
};

const AuthDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User /> <span>{user?.displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => navigate("/orders/history")}>
          Order history
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/billings")}>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/restaurants/management")}>
          Your Restaurant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Header;
