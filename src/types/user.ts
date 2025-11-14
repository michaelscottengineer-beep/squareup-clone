import type { User } from "firebase/auth";

export type TUser = {
  restaurants: {
    [id: string]: {
      id: string;
      default: string;
    };
  };
  role?: "admin" | "user";
  customerId: string;
  avatar: string;
  displayName: string;
} & Omit<User, 'displayName'>;
