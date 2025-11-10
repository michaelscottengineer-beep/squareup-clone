import type { daysOfWeek, timeSlots30min } from "@/data/date";

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
    addressInfo: {
      street1: string;
      street2: string;
      state: string;
      city: string;
      zip: string;
    };
    createdAt: string; // date: ISO string
    openingHours: TOpeningHours;
    ratingInfo: {
      rate: number;
      count: number;
    };
  };
};
