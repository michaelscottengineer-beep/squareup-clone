import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  set,
} from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import restaurantFirebaseKey from "@/factory/restaurant/restaurant.firebasekey";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import JobActionDialog from "./JobActionDialog";

const RestaurantJobLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [shippingMethod, setShippingMethod] = useState("all");

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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-4 max-w-[300px]">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                className="rounded-full"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* <Select
            defaultValue="all"
            onValueChange={(val) => setShippingMethod(val)}
          >
            <SelectTrigger>
              Type <span className="font-semibold">{shippingMethod}</span>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Dine In">Dine In</SelectItem>
            </SelectContent>
          </Select> */}
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
