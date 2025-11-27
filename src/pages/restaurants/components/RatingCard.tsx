
import { Separator } from "@/components/ui/separator";
import type { TRating } from "@/types/rating";
import {  Star, User } from "lucide-react";


const RatingCard = ({ rating }: { rating: TRating }) => {
  return (
    <div
      key={rating.id}
      className="flex items-center gap-8 shadow-sm bg-gray-50 rounded-lg p-2 h-14 relative"
    >
      <div className="author flex items-center gap-2">
        {rating.basicInfo.userInfo.avatar ? (
          <img alt="author avt" src={rating.basicInfo.userInfo.avatar} />
        ) : (
          <User />
        )}
        <div className="info flex flex-col gap-1">
          <span className="font-medium">
            {rating.basicInfo.userInfo.displayName}
          </span>
          <div className="header flex items-center gap-1 text-gray-500 text-xs">
            <span className="font-s">OrderId: {rating.basicInfo.orderId}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span>{rating.basicInfo.rate}</span>
              <Star className="fill-yellow-300 stroke-yellow-300" size={14} />
            </div>
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className=" w-1 h-1/2!" />
      <p className="content text-foreground/50">{rating.basicInfo.content}</p>

      <Separator orientation="vertical" className=" w-1 h-1/2!" />

      <div className="flex items-center gap-4">
        <img
          alt="item img"
          src={rating.basicInfo.itemInfo.image}
          className="w-10 rounded-md object-cover aspect-square h-10"
        />
        <div className="flex flex-col gap-1">
          <span className="font-medium">{rating.basicInfo.itemInfo.name}</span>
          <div className="text-sm gap-1 flex text-foreground/70 ">
            {rating.basicInfo.itemInfo.price} x{" "}
            {rating.basicInfo.itemInfo.quantity}
          </div>
        </div>
      </div>
    </div>
  );
};


export default RatingCard;