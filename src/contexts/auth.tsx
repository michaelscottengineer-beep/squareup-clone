import { auth } from "@/firebase";
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
      
      setUser(user);
    });

    return ubSub;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
