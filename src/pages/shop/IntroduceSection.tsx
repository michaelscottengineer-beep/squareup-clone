import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, StarIcon } from "lucide-react";
import { MdOutlineTableRestaurant } from "react-icons/md";

import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useCart from "@/stores/use-cart";
import PromotionSheet from "./PromotionSheet";
import ShippingMeThodSelector from "./ShippingMethodSelector";


const IntroduceSection = () => {
  return (
    <div className="grid grid-cols-3 gap-8 py-8 shop-container">
      <div className="col-span-2 space-y-6 px-10">
        <div className="text-5xl font-semibold">
          <h1 className="">Ordering from</h1>
          <h1 className="text-primary mt-3">Test Restaurant [Production]</h1>
        </div>

        <div className="more-info text-lg text-gray-600">
          <div>75 5th Street NW, Atlanta, GA 30308</div>
          <div className="flex items-center gap-1">
            4.4{" "}
            <StarIcon className="stroke-yellow-400 w-4 h-4 fill-yellow-400" />{" "}
            (1,000+ ratings)
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> Open: -
          </div>
        </div>

        <PromotionSheet
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
          src="/tmp_restaurant_img.jpeg"
          alt="introduce-restaurant-img"
          className="rounded-lg h-full w-auto object-cover"
        />
      </div>
    </div>
  );
};

export default IntroduceSection;
