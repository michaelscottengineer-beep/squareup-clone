import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router";
import { modifierColumns } from "./modifier-columns";
import type { TModifier } from "@/types/modifier";
import EmptyModifier from "./components/EmptyModifier";

const ModifierHomePage = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: modifiers, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allModifiers"],
    queryFn: async () => {
      const segments = parseSegments(
        "restaurants",
        restaurantId,
        "allModifiers"
      );
      const modifiersRef = ref(db, segments);

      const ret = await get(modifiersRef);
      return ret ? convertFirebaseArrayData<TModifier>(ret.val()) : [];
    },
  });
  if (isLoading)
    return <div className="font-bold text-xl">Loading modifiers...</div>;

  return (
    <div>
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-xl">Modifiers</h1>
        <Button
          onClick={() => navigate("/dashboard/items/modifiers/new")}
          className="rounded-full py-3 h-max w-max"
        >
          Add modifier
        </Button>
      </div>

      <DataTable columns={modifierColumns} data={modifiers ?? []} />
      {/* {!modifiers?.length && <EmptyModifier />} */}
    </div>
  );
};

export default ModifierHomePage;
