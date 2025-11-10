import { queryOptions } from "@tanstack/react-query";
import restaurantService from "./restaurant.service";

const restaurantQueyKeys = {
  allKey: () => ["allRestaurants"],
  listKey: () => [...restaurantQueyKeys.allKey(), "list"],
  list: () => {},

  userRestaurantKeys: () => [...restaurantQueyKeys.allKey(), "of-user"],
  userRestaurantIdsKey: (userId: string) => [
    ...restaurantQueyKeys.userRestaurantKeys(),
    userId,
  ],
  userRestaurantIds: (userId: string) =>
    queryOptions({
      queryKey: restaurantQueyKeys.userRestaurantIdsKey(userId),
      queryFn: () => restaurantService.getUserRestaurantIds(userId),
      staleTime: 5 * 60 * 1000,
    }),

  userRestaurantsKey: (ids: string[]) => [
    ...restaurantQueyKeys.userRestaurantKeys(),
    ids,
  ],
  userRestaurants: (ids: string[]) =>
    queryOptions({
      queryKey: restaurantQueyKeys.userRestaurantsKey(ids),
      queryFn: () => restaurantService.getUserRestaurants(ids),
      staleTime: 5 * 60 * 1000,
    }),
};

export default restaurantQueyKeys;
