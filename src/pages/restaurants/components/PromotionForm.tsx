import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
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
import type { TPromotion } from "@/types/promotion";
import type { TOpeningHours } from "@/types/restaurant";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
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
import { Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import PromotionDatePicker from "./PromotionDatePicker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type FormValues = {
  promotions: TPromotion[];
};

interface PromotionFormProps {
  isEdit?: boolean;
}

const PromotionForm = ({ isEdit }: PromotionFormProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      promotions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "promotions",
  });

  const { data: promotions } = useQuery({
    queryKey: ["restaurants", restaurantId, "allPromotions"],
    queryFn: async () => {
      const promotionsRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "allPromotions")
      );
      const qr = query(
        promotionsRef,
        orderByChild("basicInfo/isDeleted"),
        equalTo(false)
      );
      const doc = await get(qr);
      console.log(doc);
      return doc.val() ? convertFirebaseArrayData<TPromotion>(doc.val()) : [];
    },
    enabled: !!restaurantId,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const prefix = parseSegments(
        "restaurants",
        restaurantId,
        "allPromotions"
      );
      const promotionsRef = ref(db, prefix);

      const dataToActions = data.promotions.filter(
        (item) =>
          !item.basicInfo.isDeleted || (item.basicInfo.isDeleted && item.id)
      );
      const promises = dataToActions.map(async (item) => {
        console.log("id ", item.id ? "123" : "456");
        if (!item.id) return await push(promotionsRef, item);
        return await set(ref(db, parseSegments(prefix, item.id)), item);
      });

      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Updated promotions");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allPromotions"],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Updated promotions error", {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (promotions) {
      form.reset({ promotions });
    }
  }, [promotions]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {fields
          .filter((item) => !item.basicInfo.isDeleted)
          .map((field, index) => {
            return (
              <div>
                <h3 className="font-medium mb-2">Promotion {index + 1}</h3>
                <div
                  key={field.id}
                  className="flex items-end gap-8 mb-2 flex-wrap border-b border-border pb-4 max-sm:gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`promotions.${index}.basicInfo.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Title"
                            {...field}
                            disabled={!isEdit}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`promotions.${index}.basicInfo.discount`}
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <InputGroup>
                            <InputGroupAddon>
                              <InputGroupText>%</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                              value={value}
                              onChange={(e) => onChange(Number(e.target.value))}
                              disabled={!isEdit}
                              {...field}
                            />
                          </InputGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`promotions.${index}.basicInfo.schedule.date.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PromotionDatePicker
                              value={new Date(field.value)}
                              onValueChange={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              disabled={!isEdit}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>to</span>

                    <FormField
                      control={form.control}
                      name={`promotions.${index}.basicInfo.schedule.date.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PromotionDatePicker
                              value={new Date(field.value)}
                              onValueChange={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              disabled={!isEdit}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`promotions.${index}.basicInfo.schedule.time.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isEdit}
                            >
                              <SelectTrigger
                                className={cn("min-w-[120px]", {})}
                              >
                                <SelectValue placeholder={"Select time from"} />
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
                      name={`promotions.${index}.basicInfo.schedule.time.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isEdit}
                            >
                              <SelectTrigger
                                className={cn("min-w-[120px]", {})}
                              >
                                <SelectValue placeholder={"Select time to"} />
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
                    <FormField
                      control={form.control}
                      name={`promotions.${index}.basicInfo.isDeleted`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Label htmlFor="deleted-mode">
                              <Switch
                                id="deleted-mode"
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                              />
                              Deleted
                            </Label>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}

        {isEdit && (
          <div className="flex gap-4 items-center mt-4">
            <Button
              type="button"
              onClick={() => {
                append({
                  id: "",
                  basicInfo: {
                    discount: 0,
                    schedule: {
                      date: {
                        from: new Date().toISOString(),
                        to: new Date().toISOString(),
                      },
                      repeat: "",
                      time: {
                        from: "",
                        to: "",
                      },
                    },
                    title: "",
                    isDeleted: false,
                  },
                  items: {},
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
  );
};

export default PromotionForm;
