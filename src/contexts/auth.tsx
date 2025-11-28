import { auth, db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TMember } from "@/types/staff";
import type { TUser } from "@/types/user";
import { parseSegments } from "@/utils/helper";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { createContext, useCallback, useEffect, useState } from "react";

interface AuthContextProps {
  user: TUser | null;
  memberInfo: TMember | null;
  updateRestaurant: (data: TUser["restaurants"][number] | undefined) => void;
  updateUserRestaurant: (
    data: TUser["restaurants"][number] | undefined
  ) => void;
}
const AuthContext = createContext<AuthContextProps | null>(null);
const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [memberInfo, setMemberInfo] = useState<TMember | null>(null);

  async function getUserInfo(uid: string) {
    const userRef = ref(db, parseSegments("users", uid));
    const doc = await get(userRef);

    return doc.val() as TUser;
  }

  useEffect(() => {
    const ubSub = onAuthStateChanged(auth, async (userCredential) => {
      console.log(userCredential);
      if (userCredential) {
        const userInfo = await getUserInfo(userCredential.uid);
        console.log("User is signed in:", userCredential.uid, userInfo);

        const restaurants = Object.values(userInfo?.restaurants ?? {});
        const currentRestaurantId = useCurrentRestaurantId.getState().id;
        const defaultRestaurantId = restaurants.find((res) => res.default);
        console.log(
          "default restaurant",
          defaultRestaurantId,
          currentRestaurantId
        );
        if (!currentRestaurantId) {
          const resId = defaultRestaurantId?.id ?? restaurants?.[0]?.id;
          if (resId) useCurrentRestaurantId.getState().set(resId);

          if (defaultRestaurantId?.staffId || restaurants?.[0]?.staffId) {
            updateRestaurant(defaultRestaurantId || restaurants?.[0]);
          }
        } else {
          const restaurant = userInfo?.restaurants?.[currentRestaurantId];
          console.log("follow local ", restaurant, currentRestaurantId);
          updateRestaurant(restaurant);
        }

        setUser({ ...userCredential, ...userInfo });
      } else {
        useCurrentRestaurantId.getState().clear();
        setUser(null);
        if (
          !window.location.href.includes("/signin") &&
          !window.location.href.includes("/signup") &&
          !window.location.href.includes("/setup")
        )
          window.location.href = window.location.origin + "/signin";
      }
    });

    return ubSub;
  }, []);

  const updateRestaurant = useCallback(async function (
    data: TUser["restaurants"]["number"] | undefined
  ) {
    if (!data?.staffId) {
      setMemberInfo(null);
      return;
    }
    const staffRef = ref(
      db,
      parseSegments("restaurants", data.id, "allStaffs", data.staffId)
    );
    const staff = await get(staffRef);
    console.log("staff info after reset", staff.val());
    if (staff.exists()) setMemberInfo({ ...staff.val() });
    else setMemberInfo(null);
  },
  []);

  const updateUserRestaurant = useCallback(
    async function (data: TUser["restaurants"]["number"] | undefined) {
      console.log("UPDATE USER RESTAURANT", user, data);
      if (!user || !data?.id) {
        return;
      }
      const restaurantId = data.id;
      console.log("updated data", {
        ...user,
        restaurants: {
          ...user.restaurants,
          [restaurantId]: {
            ...data,
          },
        },
      });

      useCurrentRestaurantId.getState().set(restaurantId);
      setUser({
        ...user,
        restaurants: {
          ...user.restaurants,
          [restaurantId]: {
            ...data,
          },
        },
      });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, updateRestaurant, updateUserRestaurant, memberInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
