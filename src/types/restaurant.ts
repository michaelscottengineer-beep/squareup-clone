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
    ratingInfo: {
      [`1star`]: number;
      [`2star`]: number;
      [`3star`]: number;
      [`4star`]: number;
      [`5star`]: number;
      totalRating: number;
    };
    totalOrder: number;
  };
};

export type TRestaurantCustomer = {
  id: string;
  basicInfo: {
    id: string;
    fullName: string;
    email: string;
    sms: string;
  };
  orders: {
    [id: string]: { id: string };
  };
  statistics: {
    totalOrder: number;
  };
};

export type TRestaurantJob = {
  id: string;
  basicInfo: {
    name: string;
    description: string;
  };
};

export type TRestaurantTable = {
  id: string;
  basicInfo: {
    name: string;
    maxPeople: number;
    createdAt: string;
    updatedAt: string;
  };
  status?: {
    numberOfPeople: number;
    customerInfo?: { name: string; phone: string };
    bookedAt: string;
    tableStatus: "on dine" | "reserved" | "available";
    paymentStatus: "paid" | "unpaid";
  };
};
