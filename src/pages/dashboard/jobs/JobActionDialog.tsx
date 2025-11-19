import React, { useEffect, useState, type ReactNode } from "react";
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
import { db } from "@/firebase";

import { Button } from "@/components/ui/button";
import type { TRestaurantJob } from "@/types/restaurant";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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


interface JobActionDialogProps {
  trigger?: ReactNode;
  jobId?: string;
}

const JobActionDialog = ({ jobId, trigger }: JobActionDialogProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: jobData } = useQuery({
    queryKey: ["restaurants", restaurantId, "allJobs", jobId],
    queryFn: async () => {
      const jobRef = restaurantFirebaseKey({
        restaurantId,
        jobKey: jobId,
      }).jobRef();
      const doc = await get(jobRef);
      return { ...doc.val(), id: jobId } as TRestaurantJob;
    },
    enabled: !!jobId && !!restaurantId,
  });

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <JobForm defaultData={jobData} />
      </DialogContent>
    </Dialog>
  );
};

const JobForm = ({ defaultData }: { defaultData?: TRestaurantJob }) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<TRestaurantJob>({
    defaultValues: {
      basicInfo: {
        name: "",
        description: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TRestaurantJob) => {
      const keys = restaurantFirebaseKey;
      const jobKey =
        defaultData?.id || push(ref(db, keys({ restaurantId }).jobs())).key;

      const jobRef = keys({ restaurantId, jobKey }).jobBasicInfoRef();
      return await set(jobRef, {
        ...data.basicInfo,
      });
    },

    onSuccess: () => {
      toast.success("Action successfully");
      if (!defaultData) form.reset();
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allJobs"],
      });
    },
    onError: (err) => {
      console.error("Action error", err);
      toast.error("Action error", {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (defaultData) form.reset(defaultData);
  }, [defaultData]);
  const onSubmit = (data: TRestaurantJob) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name={`basicInfo.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`basicInfo.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        <Button className="ml-auto">Done</Button>
      </form>
    </Form>
  );
};

export default JobActionDialog;
