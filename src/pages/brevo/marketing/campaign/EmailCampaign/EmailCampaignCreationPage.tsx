import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign } from "@/types/brevo";
import { useMutation } from "@tanstack/react-query";
import { get, push } from "firebase/database";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TFormValues = TCampaign["basicInfo"];
const EmailCampaignCreationPage = () => {
  const form = useForm<TFormValues>({
    defaultValues: {
      type: "email",
    },
  });

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const mutation = useMutation({
    mutationFn: async (data: TFormValues) => {
      return await push(keys.allCampaignsRef(), {
        basicInfo: {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt:  new Date().toISOString(),
        },
      });
    },
    onSuccess: () => {
      toast.success("Created successfully!");
    },
    onError: (err) => {
      toast.error("Created failed: " + err.message);
    },
  });

  const onSubmit = (data: TFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="font-medium text-2xl">Create an Email campaign</h1>
        <span className="text-sm text-muted-foreground">
          Keep subscribers engaged by sharing your latest news, promoting your
          bestselling products, or announcing an upcoming event.
        </span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 pb-6 space-y-4"
        >
          <FormField
            control={form.control}
            name={`name`}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-semibold text-muted-foreground">
                  Campaign Name
                </FormLabel>

                <FormControl>
                  <Input {...field} placeholder="123" className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              variant={"secondary"}
              size={"sm"}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Spinner />}
              Create campaign
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailCampaignCreationPage;
