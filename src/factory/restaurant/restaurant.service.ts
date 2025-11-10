import { db } from "@/firebase";
import type { TRestaurant } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { get, ref } from "firebase/database";

const restaurantService = {
  getUserRestaurantIds: async (userId: string) => {
    const restaurantsRef = ref(
      db,
      parseSegments("users", userId, "restaurants")
    );

    const doc = await get(restaurantsRef);


    return doc.exists() ? Object.keys(doc.val()) : [];
  },
  getUserRestaurants: async (ids: string[]) => {
    const promise = ids.map(async (resId) => {
      const resRef = ref(db, parseSegments("restaurants", resId, "basicInfo"));
      return get(resRef);
    });

    return Promise.all(promise).then((data) => {
      return data.map(
        (snapshot, i) =>
          ({
            basicInfo: { ...snapshot.val() },
            id: ids[i],
          } as TRestaurant)
      );
    });
  },
};

export default restaurantService;
