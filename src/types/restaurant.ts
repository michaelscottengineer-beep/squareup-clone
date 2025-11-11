import type { daysOfWeek, timeSlots30min } from "@/data/date";
import type { TUser } from "./user";

export type TOpeningHours = {
  dow: {
    from: (typeof daysOfWeek)[number];
    to: (typeof daysOfWeek)[number];
  };
  time: {
    from: (typeof timeSlots30min)[number];
    to: (typeof timeSlots30min)[number];
  };
};

export type TRestaurant = {
  id: string;
  basicInfo: {
    name: string;
    image: string;
    logo: string;
    addressInfo: {
      street1: string;
      street2: string;
      state: string;
      city: string;
      zip: string;
    };
    createdByObj: TUser;
    createdBy: string;
    createdAt: string; // date: ISO string
    openingHours: TOpeningHours;
    ratingInfo: {
      rate: number;
      count: number;
    };
  };
  statistics: {
    totalRevenue: number;
    totalStaff: number;
    averageRating: number;
  };
};
