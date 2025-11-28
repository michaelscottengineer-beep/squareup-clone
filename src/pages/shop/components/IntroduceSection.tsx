import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, StarIcon } from "lucide-react";
import { MdOutlineTableRestaurant } from "react-icons/md";

import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useCart from "@/stores/use-cart";
import PromotionSheet from "./promotion/PromotionSheet";
import ShippingMeThodSelector from "./checkout/ShippingMethodSelector";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import {
  convertFirebaseArrayData,
  getConcatAddress,
  parseSegments,
} from "@/utils/helper";
import type { TOpeningHours, TRestaurant } from "@/types/restaurant";
import type { TPromotion } from "@/types/promotion";
import { useParams } from "react-router";

const IntroduceSection = () => {
  const { shopId: shopSlug } = useParams();

  const { data: restaurant } = useQuery({
    queryKey: ["restaurants", "details", shopSlug],
    queryFn: async () => {
      const restaurantRef = ref(db, parseSegments("/restaurants/", shopSlug));

      const restaurant = await get(restaurantRef);
      const val = restaurant.val() as TRestaurant;

      return val;
    },
    enabled: !!shopSlug,
  });

  const { data: promotions, isLoading } = useQuery({
    queryKey: ["allPromotions"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", shopSlug, "/allPromotions")
      );

      const categories = await get(categoriesRef);
      const val = categories.val() as TPromotion;

      return val ? convertFirebaseArrayData<TPromotion>(categories.val()) : [];
    },
    enabled: !!shopSlug,
  });

  const address = restaurant?.basicInfo?.addressInfo;

  return (
    <div className="grid grid-cols-3 gap-8 py-8 shop-container">
      <div className="col-span-2 space-y-6 px-10">
        <div className="text-5xl font-semibold">
          <h1 className="">Ordering from</h1>
          <h1 className="text-primary mt-3">{restaurant?.basicInfo.name}</h1>
        </div>

        <div className="more-info text-lg text-gray-600">
          <div>
            {address &&
              getConcatAddress(
                address?.street1 || address?.street2 || "",
                address?.city,
                address?.state,
                address?.zip
              )}
          </div>
          <div className="flex items-center gap-1">
            <span>{restaurant?.basicInfo.ratingInfo.rate}</span>
            <StarIcon className="stroke-yellow-400 w-4 h-4 fill-yellow-400" /> (
            {restaurant?.basicInfo.ratingInfo.count} ratings)
          </div>
          <OpeningHoursSection />
        </div>

        <PromotionSheet
          promotions={promotions ?? []}
          triggerButton={
            <Button className="promo-box px-2 py-7 text-black flex items-center w-full">
              <div className="flex-1 text-center">
                Limited Offer: <strong className="text-primary">10% OFF</strong>{" "}
                Today!
              </div>
              <ArrowRight className="ml-auto stroke-1 w-5 h-5" />
            </Button>
          }
        />

        <ShippingMeThodSelector />
      </div>
      <div>
        <img
          src={restaurant?.basicInfo.image || "/restaurant_placeholder.png"}
          alt="introduce-restaurant-img"
          className="rounded-lg w-auto aspect-square object-cover"
        />
      </div>
    </div>
  );
};

const OpeningHoursSection = () => {
  const { shopId: shopSlug } = useParams();

  const { data: hours } = useQuery({
    queryKey: ["restaurants", shopSlug, "basicInfo", "openingHours"],
    queryFn: async () => {
      const openHourRef = ref(
        db,
        parseSegments("restaurants", shopSlug, "basicInfo", "openingHours")
      );
      const doc = await get(openHourRef);
      return doc.val() as TOpeningHours[];
    },
    enabled: !!shopSlug,
  });

  return (
    <div className="flex items-start gap-2 text-sm mt-4">
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" /> Open:
      </div>
      <div className="flex flex-col gap-2">
        {hours?.map((h, i) => {
          return (
            <div key={i} className="flex items-center  gap-2">
              <span>-</span>
              <div className="flex items-center gap-2">
                <span>{h.dow.from}</span>
                {h.dow.from !== h.dow.to && (
                  <>
                    <span>to</span>
                    <span>{h.dow.to}</span>
                  </>
                )}
              </div>
              <div className="flex items-center flex-1 gap-2">
                <span className="ml-auto">{h.time.from}</span>
                <span>to</span>
                <span>{h.time.to}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default IntroduceSection;
