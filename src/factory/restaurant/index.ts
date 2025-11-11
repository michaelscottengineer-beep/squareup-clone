import { useQuery } from "@tanstack/react-query";
import restaurantQueyKeys from "./restaurant.queries";

export const useUserRestaurantIdsQuery = (userId?: string) =>
  useQuery({
    ...restaurantQueyKeys.userRestaurantIds(userId!),
    enabled: !!userId,
  });

export const useUserRestaurantsQuery = (ids: string[]) =>
  useQuery({
    ...restaurantQueyKeys.userRestaurants(ids),
    enabled: !!ids && ids.length > 0,
  });

export const useRestaurantsQuery = () =>
  useQuery({
    ...restaurantQueyKeys.list(),
  });
export const useAdminRestaurantsQuery = () =>
  useQuery({
    ...restaurantQueyKeys.adminList(),
  });
