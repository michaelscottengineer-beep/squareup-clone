import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useNavigate } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import restaurantFirebaseKey from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import type { TRestaurantJob } from "@/types/restaurant";
import { convertFirebaseArrayData } from "@/utils/helper";

interface StaffJobSelectorProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  restaurantId: string;
  disabled?: boolean;
}

const StaffJobSelector = ({
  defaultValue,
  restaurantId,
  disabled,
  value,
  onValueChange,
}: StaffJobSelectorProps) => {
  const navigate = useNavigate();
  const [curValue, setCurValue] = useState(value);

  const { data: jobs, isLoading } = useQuery({
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

  useEffect(() => {
    setCurValue(value);
  }, [value]);
  return (
    <Select
      value={curValue}
      onValueChange={(val) => onValueChange?.(val)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        {value ? <SelectValue placeholder="Select Job" /> : "Select Job"}
      </SelectTrigger>

      <SelectContent className="">
        {jobs?.map((job, i) => {
          return (
            <SelectItem
              key={job.id}
              value={job.basicInfo.name}
              className="capitalize"
            >
              {job.basicInfo.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StaffJobSelector;
