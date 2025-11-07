import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { daysOfWeek, timeSlots30min } from "@/data/date";
import { db } from "@/firebase";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TOpeningHours } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";
import { Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  openingHours: TOpeningHours[];
};

interface OpeningHoursFormProps {
  isEdit?: boolean;
}
const OpeningHoursForm = ({ isEdit }: OpeningHoursFormProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      openingHours: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "openingHours",
  });

  const { data: hours } = useQuery({
    queryKey: ["restaurants", restaurantId, "basicInfo", "openingHours"],
    queryFn: async () => {
      const openHourRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "basicInfo", "openingHours")
      );
      const doc = await get(openHourRef);
      console.log(doc);
      return doc.val() as TOpeningHours[];
    },
    enabled: !!restaurantId,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const openHourRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "basicInfo", "openingHours")
      );
      return await set(openHourRef, data.openingHours);
    },
    onSuccess: () => {
      toast.success("Update opening hours");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "basicInfo", "openingHours"],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Update opening hours error", {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (hours) {
      form.reset({ openingHours: hours });
    }
  }, [hours]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    const openingHours = data.openingHours;

    for (let i = 0; i < openingHours.length; i++) {
      const val = openingHours[i];
      const dayFromIdx = daysOfWeek.indexOf(val.dow.from);
      const dayToIdx = daysOfWeek.indexOf(val.dow.to);
      if (dayFromIdx > dayToIdx) {
        const message = `To must be grater than From at row ${i} ! `;
        toast.error("Update failed", {
          description: message,
          position: "top-center",
        });
        form.setError(`openingHours.${i}.dow.from`, {
          message,
        });
        form.setError(`openingHours.${i}.dow.to`, {
          message,
        });
        return;
      }
    }
    // #region check conflict
    const obj = openingHours.reduce((acc, cur, curIdx) => {
      const dayFromIdx = daysOfWeek.indexOf(cur.dow.from);
      const dayToIdx = daysOfWeek.indexOf(cur.dow.to);
      for (let i = dayFromIdx; i <= dayToIdx; i++) {
        if (!acc[i]) acc[i] = [];
        acc[i].push(curIdx);
        acc[i] = acc[i].sort();
      }

      return acc;
    }, {} as { [key: number]: number[] });

    console.log(obj);
    for (const [key, val] of Object.entries(obj)) {
      if (val?.length && val.length > 1) {
        toast.error("Update failed", {
          description: `Opening hours are conflict at rows ${val.join(
            ", "
          )} ! `,
          position: "top-center",
        });
        return;
      }
    }
    // #endregion

    mutation.mutate(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex items-center gap-8 mb-2">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`openingHours.${index}.dow.from`}
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={value ?? ""}
                            onValueChange={field.onChange}
                            disabled={!isEdit}
                          >
                            <SelectTrigger
                              className={cn("min-w-[120px]", {
                                "border-destructive": !!form.getFieldState(
                                  `openingHours.${index}.dow.to`
                                ).error,
                              })}
                            >
                              <SelectValue placeholder={"Select dayOfWeek"} />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((d) => {
                                return (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span>to</span>
                  <FormField
                    control={form.control}
                    name={`openingHours.${index}.dow.to`}
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={value ?? ""}
                            onValueChange={field.onChange}
                            disabled={!isEdit}
                          >
                            <SelectTrigger
                              className={cn("min-w-[120px]", {
                                "border-destructive": !!form.getFieldState(
                                  `openingHours.${index}.dow.to`
                                ).error,
                              })}
                            >
                              <SelectValue placeholder={"Select dayOfWeek"} />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((d) => {
                                return (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`openingHours.${index}.time.from`}
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={value ?? ""}
                            onValueChange={field.onChange}
                            disabled={!isEdit}
                          >
                            <SelectTrigger className={"min-w-[120px]"}>
                              <SelectValue placeholder={"Select time"} />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots30min.map((d) => {
                                return (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span>to</span>
                  <FormField
                    control={form.control}
                    name={`openingHours.${index}.time.to`}
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={value ?? ""}
                            onValueChange={field.onChange}
                            disabled={!isEdit}
                          >
                            <SelectTrigger className={"min-w-[120px]"}>
                              <SelectValue placeholder={"Select time"} />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots30min.map((d) => {
                                return (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {isEdit && (
                  <Button
                    onClick={() => remove(index)}
                    size={"icon-sm"}
                    className="p-0 bg-transparent text-destructive hover:bg-destructive/20"
                  >
                    <X />
                  </Button>
                )}
              </div>
            );
          })}
          {isEdit && (
            <div className="flex gap-4 items-center mt-4">
              <Button
                type="button"
                onClick={() => {
                  append({
                    dow: { from: "Monday", to: "Monday" },
                    time: { from: "07:00", to: "17:30" },
                  });
                }}
                variant={"secondary"}
              >
                Add
              </Button>
              <Button type="submit">Update</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default OpeningHoursForm;
