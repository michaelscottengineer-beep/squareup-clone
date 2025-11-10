import { auth, db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TUser } from "@/types/user";
import { parseSegments } from "@/utils/helper";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: TUser | null;
}
const AuthContext = createContext<AuthContextProps | null>(null);
const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<TUser | null>(null);

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

        const restaurants = Object.values(userInfo.restaurants);
        const currentRestaurantId = useCurrentRestaurantId.getState().id;
        const defaultRestaurantId = restaurants.find((res) => res.default);
        if (!currentRestaurantId)
          useCurrentRestaurantId
            .getState()
            .set(defaultRestaurantId?.id ?? restaurants?.[0].id ?? "NO RESTAURANT");

        setUser({ ...userCredential, ...userInfo });
      } else {
        useCurrentRestaurantId.getState().clear();
        setUser(null);
        window.location.href = window.location.origin + "/signin";
      }
    });

    return ubSub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
