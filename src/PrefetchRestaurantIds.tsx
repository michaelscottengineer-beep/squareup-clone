import React, { useEffect } from "react";
import useAuth from "./hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "./firebase";
import { parseSegments } from "./utils/helper";
import type { TRestaurant } from "./types/restaurant";
import useCurrentRestaurantId from "./stores/use-current-restaurant-id.store";

const PrefetchRestaurantIds = () => {
  const { user } = useAuth();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const setRestaurantId = useCurrentRestaurantId((state) => state.set);

  const restaurantsRef = ref(db, parseSegments('users', user?.uid, 'restaurants'));


  const { data: restaurantIds } = useQuery({
    queryKey: ["restaurants", "of-user", user?.uid, 'list-of-id'],
    queryFn: async () => {
    

      const doc = await get(restaurantsRef);

      return doc.exists() ? Object.keys(doc.val()) : []  
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.uid,
  });


  useEffect(() => {
    
  }, [])


  return null;
};

export default PrefetchRestaurantIds;
