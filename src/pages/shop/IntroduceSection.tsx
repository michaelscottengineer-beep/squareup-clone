import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, StarIcon } from "lucide-react";
import { MdOutlineTableRestaurant } from "react-icons/md";

import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useCart from "@/stores/use-cart";
import PromotionSheet from "./PromotionSheet";

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

        <KindOfOrderSelection />
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

const KindOfOrderSelection = () => {
  const data = [
    { icon: MdOutlineTableRestaurant, label: "Dine In" },
    { icon: PiHandWavingBold, label: "Pickup" },
    { icon: IoCarSportOutline, label: "Delivery" },
  ];
  const [selected, setSelected] = useState(data[0]);

  return (
    <div className="kind-of-order flex items-center gap-4 my-2 px-1">
      {data.map((k) => {
        const isActive = k.label === selected.label;

        return (
          <Button
            key={k.label}
            className={cn(
              "flex flex-col h-max w-max border-b-2 border-b-transparent items-start gap-2 text-muted-foreground! hover:bg-transparent bg-transparent",
              {
                "text-black! border-b-primary rounded-bl-none rounded-br-none":
                  isActive,
              }
            )}
            onClick={() => setSelected(k)}
          >
            <k.icon className="h-6! w-6!" />
            <span>{k.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
export default IntroduceSection;
