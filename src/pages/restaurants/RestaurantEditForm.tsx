import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const RestaurantEditForm = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  useEffect(() => {
    navigate("/dashboard/restaurants/" + restaurantId);
  }, [restaurantId]);

  return null;
};

export default RestaurantEditForm;
