import type { User } from "firebase/auth";

export type TUser = {
  restaurants: {
    [id: string]: {
      id: string;
      default: string;
    };
  };
  displayName: string;
} & Omit<User, 'displayName'>;
