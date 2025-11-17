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
import type { TPermission } from "@/types/permission";

interface PermissionActionDialogProps {
  trigger?: ReactNode;
  permissionKey?: string;
}

const PermissionActionDialog = ({
  permissionKey,
  trigger,
}: PermissionActionDialogProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: jobData } = useQuery({
    queryKey: ["restaurants", restaurantId, "allPermissions", permissionKey],
    queryFn: async () => {
      const permissionRef = restaurantFirebaseKey({
        restaurantId,
        permissionKey: permissionKey,
      }).permissionRef();
      const doc = await get(permissionRef);
      return { ...doc.val(), id: permissionKey } as TPermission;
    },
    enabled: !!permissionKey && !!restaurantId,
  });

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <PermissionForm defaultData={jobData} />
      </DialogContent>
    </Dialog>
  );
};

const PermissionForm = ({ defaultData }: { defaultData?: TPermission }) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<TPermission>({
    defaultValues: {
      basicInfo: {
        name: "",
        description: "",
        shortName: ""
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TPermission) => {
      const keys = restaurantFirebaseKey;
      const permissionKey =
        defaultData?.id || push(ref(db, keys({ restaurantId }).permissions())).key;

      const permissionRef = keys({ restaurantId, permissionKey }).permissionBasicInfoRef();
      return await set(permissionRef, {
        ...data.basicInfo,
      });
    },

    onSuccess: () => {
      toast.success("Action successfully");
      if (!defaultData) form.reset();
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allPermissions"],
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
  const onSubmit = (data: TPermission) => {
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
              <FormLabel>Permission Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Manage Orders" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`basicInfo.shortName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Short Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="@shortName" />
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
              <FormLabel>Permission Description</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Access to Orders and Order Histories"
                />
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

export default PermissionActionDialog;
