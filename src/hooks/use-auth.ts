import { AuthContext } from "@/contexts/auth";
import { useContext } from "react";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be placed in authprovider");
  return context;
}
