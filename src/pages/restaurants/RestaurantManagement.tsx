import { Search } from "lucide-react";

import useAuth from "@/hooks/use-auth";

import { useNavigate } from "react-router";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { restaurantColumns } from "./restaurantColumns";
import {
  useUserRestaurantIdsQuery,
  useUserRestaurantsQuery,
} from "@/factory/restaurant";

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurantIds } = useUserRestaurantIdsQuery(user?.uid);

  const { data: restaurants } = useUserRestaurantsQuery(restaurantIds ?? []);

  return (
    <div className="px-2">
      <div className="flex justify-between mb-3 items-center">
        <div className="flex gap-4 max-w-[300px]"></div>

        <div className="flex items-center gap-2">
          {/* <QuickCreationDialog /> */}
          <Button
            className="rounded-full px-5 py-3"
            onClick={() => navigate("/dashboard/restaurants/new")}
          >
            Create new
          </Button>
        </div>
      </div>

      <DataTable columns={restaurantColumns} data={restaurants ?? []} />
    </div>
  );
};

export default RestaurantManagement;
