import { auth } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TUser } from "@/types/user";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: TUser | null;
}
const AuthContext = createContext<AuthContextProps | null>(null);
const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    const ubSub = onAuthStateChanged(auth, (userCredential) => {
      console.log(userCredential);

      if (userCredential) {
        console.log("User is signed in:", userCredential.uid);
        useCurrentRestaurantId.getState().set("user_" + userCredential.uid);
      } else {
        useCurrentRestaurantId.getState().clear();
        window.location.href = window.location.origin + "/signin";
      }

      setUser(userCredential);
    });

    return ubSub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
