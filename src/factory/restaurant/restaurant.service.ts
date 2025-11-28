import { db } from "@/firebase";
import type { TRestaurant } from "@/types/restaurant";
import type { TUser } from "@/types/user";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { get, orderByChild, query, ref } from "firebase/database";

const restaurantService = {
  getRestaurants: async () => {
    const restaurantsRef = ref(db, parseSegments("restaurants"));

    const doc = await get(restaurantsRef);

    const data = doc.exists()
      ? convertFirebaseArrayData<TRestaurant>(doc.val())
      : [];

    const promise = data.map(async (res) => {
      const userRef = ref(db, parseSegments("users", res.basicInfo.createdBy));
      const doc = await get(userRef);
      return {
        ...res,
        basicInfo: {
          ...res.basicInfo,
          createdByObj: doc.val() as TUser,
        },
      };
    });

    return Promise.all(promise);
  },
  getAdminRestaurants: async () => {
    try {
      const restaurantsRef = ref(db, parseSegments("restaurants"));
      const qr = query(restaurantsRef, orderByChild("basicInfo/createdBy"));
      const doc = await get(qr);

      const data = doc.exists()
        ? convertFirebaseArrayData<TRestaurant>(doc.val())
        : [];

      const promise = data.map(async (res) => {
        const userRef = ref(
          db,
          parseSegments("users", res.basicInfo.createdBy)
        );
        const doc = await get(userRef);
        return {
          ...res,
          basicInfo: {
            ...res.basicInfo,
            createdByObj: doc.val() as TUser,
          },
        };
      });

      return Promise.all(promise);
    } catch (err) {
      console.error("err", err);
      return [];
    }
  },
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
