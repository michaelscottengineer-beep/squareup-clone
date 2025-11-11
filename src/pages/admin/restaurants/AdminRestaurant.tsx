import { DataTable } from "@/components/ui/data-table";
import {
  useAdminRestaurantsQuery,
  useRestaurantsQuery,
} from "@/factory/restaurant";
import { restaurantColumns } from "./restaurantColumns";

const AdminRestaurant = () => {
  const { data: restaurants } = useAdminRestaurantsQuery();

  return (
    <div className="px-2">
  

      {!restaurants?.length ? (
        <div>No items</div>
      ) : (
        <DataTable columns={restaurantColumns} data={restaurants} />
      )}
    </div>
  );
};

export default AdminRestaurant;
