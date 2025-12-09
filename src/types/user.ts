import type { User } from "firebase/auth";
import type { TMember } from "./staff";

export type TUser = {
  restaurants: {
    [id: string]: {
      id: string;
      default: boolean;
      staffId?: string;
      staffObj?: TMember;
    };
  };
  memberInfo?: TMember;
  role?: "admin" | "user";
  customerId: string;
  avatar: string;
  displayName: string;
  sms: string;
} & Omit<User, "displayName">;
