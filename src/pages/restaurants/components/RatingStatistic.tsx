import { Label } from "@/components/ui/label";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TRestaurant } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, ref } from "firebase/database";
import { Star, User } from "lucide-react";

const RatingStatistic = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const { data: ratingInfo } = useQuery({
    queryKey: ["restaurants", restaurantId, "ratingInfo"],
    queryFn: async () => {
      const resRef = ref(
        db,
        parseSegments(
          ...["restaurants", restaurantId, "statistics", "ratingInfo"]
        )
      );

      const doc = await get(resRef);

      return doc.val() as TRestaurant["statistics"]["ratingInfo"];
    },
    enabled: !!restaurantId,
  });

  const calcAvgRating = () => {
    if (!ratingInfo) return 0;
    const avg =
      Array.from<number>({ length: 5 }).reduce((acc, cur, i) => {
        const key = (i + 1 + "star") as keyof typeof ratingInfo;
        const val = ratingInfo[key] * (i + 1);
        return val + acc;
      }, 0) / ratingInfo["totalRating"];

    return avg ? avg : 0;
  };
  return (
    <div className="my-4">
      <Label className="mb-4">Restaurant Rating Statistic</Label>
      <div className="flex items-center">
        Current: {calcAvgRating()}{" "}
        <Star size={14} className="fill-yellow-300 stroke-yellow-300" />
      </div>
      <div className="flex items-center gap-6">
        {Array.from({ length: 5 }).map((_, i) => {
          return (
            <div key={i + 1} className="flex items-center gap-1">
              <span className="text-xs">{i + 1}</span>
              <Star size={14} className="fill-yellow-300 stroke-yellow-300" />
              <span className="text-xs">{`(${
                ratingInfo?.[`${i + 1}star` as keyof typeof ratingInfo] ?? 0
              } ratings)`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingStatistic;
