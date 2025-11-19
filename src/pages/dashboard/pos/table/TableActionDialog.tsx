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
import type { TRestaurantJob, TRestaurantTable } from "@/types/restaurant";
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
import tableFirebaseKey from "@/factory/table/table.firebaseKey";

interface TableActionDialogProps {
  trigger?: ReactNode;
  tableId?: string;
}

const TableActionDialog = ({ tableId, trigger }: TableActionDialogProps) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: tableData } = useQuery({
    queryKey: ["restaurants", restaurantId, "allTables", tableId],
    queryFn: async () => {
      const tableRef = tableFirebaseKey({
        restaurantId,
        tableId,
      }).detailsRef();
      const doc = await get(tableRef);
      return { ...doc.val(), id: tableId } as TRestaurantTable;
    },
    enabled: !!tableId && !!restaurantId,
  });

  return (
    <Dialog>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <TableForm defaultData={tableData} />
      </DialogContent>
    </Dialog>
  );
};

const TableForm = ({ defaultData }: { defaultData?: TRestaurantTable }) => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const form = useForm<TRestaurantTable>({
    defaultValues: {
      basicInfo: {
        name: "",
        maxPeople: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TRestaurantTable) => {
      const keys = tableFirebaseKey({ restaurantId });
      const newTableId = defaultData?.id || push(ref(db, keys.root())).key;

      keys.addParams({ tableId: newTableId });
      const tableRef = keys.basicInfoRef();
      return await set(tableRef, {
        ...data.basicInfo,
      });
    },

    onSuccess: () => {
      toast.success("Action successfully");
      if (!defaultData) form.reset();
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allTables"],
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
  const onSubmit = (data: TRestaurantTable) => {
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
              <FormLabel>Table Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`basicInfo.maxPeople`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max People</FormLabel>

              <FormControl>
                <Input {...field} type="number" />
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

export default TableActionDialog;
