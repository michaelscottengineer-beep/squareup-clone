import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const RestaurantForm = () => {
  const { user } = useAuth();
  const { restaurantId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm<TRestaurant>({
    defaultValues: {
      basicInfo: {
        addressInfo: {
          state: "",
          street: "",
        },
        name: "",
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
      updates[parseSegments(restaurantPrefixSegment, "basicInfo")] =
        data.basicInfo;
      return await update(ref(db), updates);
    },

    onSuccess: () => {
      toast.success(`${restaurantId ? "Saved" : "Create"} successfully!`);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["restaurants", "of-user", user?.uid],
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
      form.reset(restaurant);
    }
  }, [restaurant]);

  const onSubmit = (data: TRestaurant) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-2xl">Create new Restaurants</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name={`basicInfo.addressInfo.street`}
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
            name={`basicInfo.addressInfo.state`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Enter the state" />
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
