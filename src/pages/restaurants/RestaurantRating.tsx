import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TOrderDocumentData } from "@/types/checkout";
import type { TRating } from "@/types/rating";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { ListFilter, Star, User } from "lucide-react";
import React, { useState } from "react";
import RatingCard from "./components/RatingCard";
import RatingStatistic from "./components/RatingStatistic";

const RestaurantRating = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [selectedValue, setSelectedValue] = useState("All");

  const { data: ratings } = useQuery({
    queryKey: ["restaurants", restaurantId, "allRatings", selectedValue],
    queryFn: async () => {
      const resRef = ref(
        db,
        parseSegments(...["restaurants", restaurantId, "allRatings"])
      );
      let qr = null;
      if (selectedValue !== "All") {
        qr = query(
          resRef,
          orderByChild("basicInfo/rate"),
          equalTo(Number(selectedValue))
        );
      }
      const doc = await get(qr ?? resRef);
      const data = Object.entries(
        (doc.val() ?? {}) as { [key: string]: TRating }
      ).map(async ([id, item]) => {
        const orderRef = ref(
          db,
          parseSegments(
            "restaurants",
            restaurantId,
            "allOrders",
            item.basicInfo.orderId
          )
        );
        const order = await get(orderRef);
        const orderData = order.val() as TOrderDocumentData;
        const itemData = orderData.cartItems[item.basicInfo.itemId];
        const userRef = ref(
          db,
          parseSegments("users", item.basicInfo.createdBy)
        );
        const user = await get(userRef);

        return {
          ...item,
          id,
          basicInfo: {
            ...item.basicInfo,
            orderInfo: order.val(),
            userInfo: user.val(),
            itemInfo: itemData,
          },
        } as TRating;
      });

      return await Promise.all(data);
    },
    enabled: !!restaurantId,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">RestaurantRating</h1>
      <RatingStatistic />

      <div className="flex items-center mb-4 gap-4">
        <Button className="bg-blue-50 hover:bg-blue-50 hover:shadow-blue-100 hover:shadow-lg ">
          <ListFilter className="text-blue-500 " />
        </Button>
        <Select value={selectedValue} onValueChange={setSelectedValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 6 }).map((_, i) => {
              return (
                <SelectItem
                  value={i === 5 ? "All" : (i + 1).toString()}
                  key={i + 1}
                  className="flex items-center gap-1"
                >
                  <span className="text-xs">{i === 5 ? "All" : i + 1}</span>
                  <Star
                    size={14}
                    className="fill-yellow-300 stroke-yellow-300"
                  />
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {!ratings?.length && <div>No ratings</div>}
        {ratings?.map((rating) => {
          return <RatingCard rating={rating} key={rating.id} />;
        })}
      </div>
    </div>
  );
};

export default RestaurantRating;
