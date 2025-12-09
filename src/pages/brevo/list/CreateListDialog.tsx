"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBrevoFirebaseKey } from "@/factory/brevo/brevo.firebaseKey";
import { increment, push, ref, update } from "firebase/database";
import { db } from "@/firebase";
import {
  convertSegmentToQueryKey,
  initFirebaseUpdateVariable,
} from "@/utils/helper";
import { toast } from "sonner";
import type { TContactList } from "@/types/brevo";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormData = TContactList["basicInfo"];

export function CreateListDialog({
  open,
  onOpenChange,
}: CreateListDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = form;

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const newList = await push(keys.allListsRef());
      keys.setParams({ listId: newList.key });

      const topicRes = await fetch(import.meta.env.VITE_BASE_URL + "/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.name }),
      });
      const topicRet = await topicRes.json();
      if (!topicRet || topicRet.err) {
        throw new Error(topicRet.err);
      }

      const updates = initFirebaseUpdateVariable();

      updates[keys.detailedListBasicInfo()] = {
        ...data,
        topicArn: topicRet.data,
        createdAt: new Date().toISOString(),
      };
      updates[keys.detailedList() + "/stats/totalContact"] = increment(0);

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Created successfully!");
      reset();
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: convertSegmentToQueryKey(keys.allLists()),
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Created failed: " + err.message);
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Create a List
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 pb-6 space-y-4"
          >
            <FormField
              control={control}
              name={`name`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold text-muted-foreground">
                    List Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                className="text-[#0b4d2c]"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1a1a2e] hover:bg-[#16162a] text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Spinner />} Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
