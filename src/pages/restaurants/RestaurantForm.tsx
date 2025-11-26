import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import restaurantQueyKeys from "@/factory/restaurant/restaurant.queries";
import { db } from "@/firebase";
import useAuth from "@/hooks/use-auth";
import type { TRestaurant } from "@/types/restaurant";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, push, ref, set, update } from "firebase/database";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import UploadImageArea from "@/components/UploadImageArea";

const RestaurantForm = () => {
  const { user } = useAuth();
  const { restaurantId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm<TRestaurant>({
    defaultValues: {
      basicInfo: {
        addressInfo: {
          state: "",
          street1: "",
          street2: "",
          city: "",
          zip: "",
        },
        image: "",
        logo: "",
        ratingInfo: {
          rate: 0,
          count: 0,
        },
        name: "",
      },
      statistics: {
        totalRevenue: 0,
        averageRating: 0,
        totalStaff: 0,
        totalOrder: 0,
      },
    },
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurants", "details", restaurantId],
    queryFn: async () => {
      const restaurantRef = ref(db, parseSegments("restaurants", restaurantId));
      const doc = await get(restaurantRef);

      return doc.val() as TRestaurant;
    },
    enabled: !!restaurantId && restaurantId !== "new",
  });

  const mutation = useMutation({
    mutationFn: async (data: TRestaurant) => {
      let newRestaurantId = null;
      const userRestaurantPrefixSegment = parseSegments(
        "users",
        user?.uid,
        "restaurants"
      );

      let restaurantPrefixSegment = parseSegments("restaurants");
      if (restaurantId) {
        newRestaurantId = restaurantId;
      } else {
        const newRestaurant = await push(ref(db, restaurantPrefixSegment));
        newRestaurantId = newRestaurant.key;
      }

      restaurantPrefixSegment = parseSegments(
        restaurantPrefixSegment,
        newRestaurantId
      );

      const updates: { [key: string]: any } = {};
      updates[parseSegments(userRestaurantPrefixSegment, newRestaurantId)] = {
        id: newRestaurantId,
        default: false,
      };
      updates[parseSegments(restaurantPrefixSegment, "basicInfo")] = {
        ...data.basicInfo,
        createdBy: user?.uid,
      };
      updates[parseSegments(restaurantPrefixSegment, "statistics")] =
        data.statistics;
      return await update(ref(db), updates);
    },

    onSuccess: () => {
      toast.success(`${restaurantId ? "Saved" : "Create"} successfully!`);
      if (!restaurantId) form.reset();
      queryClient.invalidateQueries({
        queryKey: restaurantQueyKeys.userRestaurantKeys(),
      });
    },
    onError: (err) => {
      console.error(
        `${restaurantId ? "Saved" : "Create"} restaurant error`,
        err
      );
      toast.error(`${restaurantId ? "Saved" : "Create"} error`, {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (restaurant) {
      const currentValues = form.getValues();
      form.reset({
        ...currentValues,
        basicInfo: { ...currentValues.basicInfo, ...restaurant.basicInfo },
      });
    }
  }, [restaurant]);

  const onSubmit = (data: TRestaurant) => {
    console.log("data form", data);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-2xl">
        {restaurantId ? "Edit" : "Create new"} Restaurants
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-[400px]"
        >
          <FormField
            control={form.control}
            name={`basicInfo.name`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Enter the restaurant name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.addressInfo.street1`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Enter the street address" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`basicInfo.addressInfo.street2`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter the Apt, Suit, Unit, .etc."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`basicInfo.addressInfo.city`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input {...field} placeholder="Enter the city" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`basicInfo.addressInfo.state`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Enter the state" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`basicInfo.addressInfo.zip`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Enter the zip" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.image`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preview Image</FormLabel>
                <FormControl>
                  <UploadImageArea
                    value={field.value ?? ""}
                    onValueChange={(url) => field.onChange(url)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`basicInfo.logo`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Logo</FormLabel>
                <FormControl>
                  <UploadImageArea
                    value={field.value ?? ""}
                    onValueChange={(url) => field.onChange(url)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button>{restaurantId ? "Save" : "Create"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default RestaurantForm;
