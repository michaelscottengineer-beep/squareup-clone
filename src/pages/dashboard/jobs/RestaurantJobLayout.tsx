import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery,  } from "@tanstack/react-query";
import {
  get,
  ref,
} from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData,  } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import { restaurantJobColumns } from "./restaurantJobColumns";
import type { TRestaurantJob } from "@/types/restaurant";

import restaurantFirebaseKey from "@/factory/restaurant/restaurant.firebasekey";
import JobActionDialog from "./JobActionDialog";

const RestaurantJobLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: items, isLoading } = useQuery({
    queryKey: ["restaurants", restaurantId, "allJobs"],
    queryFn: async () => {
      try {
        const path = restaurantFirebaseKey({ restaurantId }).jobs();
        const jobsRef = ref(db, path);

        const snap = await get(jobsRef);

        return snap.val()
          ? convertFirebaseArrayData<TRestaurantJob>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  console.log("orders", items);
  return (
    <div className="px-2 space-y-4">
      <h1 className="text-xl font-bold">Jobs</h1>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
       
        </div>

        <div className="flex items-center gap-2">
          <JobActionDialog trigger={<Button>Create new Job</Button>} />
        </div>
      </div>

      <DataTable columns={restaurantJobColumns} data={items ?? []} />
    </div>
  );
};

export default RestaurantJobLayout;
