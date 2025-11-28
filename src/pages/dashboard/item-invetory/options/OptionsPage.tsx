import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/ui/data-table";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
  parseSegments,
} from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { useNavigate } from "react-router";
// import { modifierColumns } from "./modifier-columns";
import type { TOption } from "@/types/option";
import { optionColumns } from "./option-columns";
import EmptyOption from "./components/EmptyOption";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";

const OptionsPage = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const { data: options, isLoading } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allOptions()),
    queryFn: async () => {
      const segments = keys.allOptions();
      const optionsRef = ref(db, segments);

      const ret = await get(optionsRef);
      return convertFirebaseArrayData<TOption>(ret.val());
    },
  });
  if (isLoading)
    return <div className="font-bold text-xl">Loading options...</div>;

  return (
    <div>
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-xl">Options</h1>
        <Button
          onClick={() => navigate("/dashboard/items/options/new")}
          className="rounded-full py-3 h-max w-max"
        >
          Add options
        </Button>
      </div>

      <DataTable columns={optionColumns} data={options ?? []} />
      {/* {!options?.length && <Em'ptyOption />} */}
    </div>
  );
};

export default OptionsPage;
