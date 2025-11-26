import type { TItem } from "@/types/item";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { push, ref } from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { db } from "@/firebase";

import { ArrowLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const QuickCreationDialog = () => {
  const queryClient = useQueryClient();

  const form = useForm<Pick<TItem, "name" | "price">>({
    defaultValues: {
      name: "",
      price: "",
    },
  });
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const mutation = useMutation({
    mutationFn: async (formData: Pick<TItem, "name" | "price">) => {
      const prefix = parseSegments("/restaurants/", restaurantId);

      const itemsRef = ref(db, parseSegments(prefix, "allItems"));

      return await push(itemsRef, formData);
    },
    onSuccess: () => {
      toast.success("Created successfully");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: () => [toast.error("Created error")],
  });

  const onSubmit = (data: Pick<TItem, "name" | "price">) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="justify-start gap-3  py-2 h-max  rounded-full px-4 hover:bg-muted"
        >
          <div className="p-2 h-max w-max bg-muted rounded-md">
            <Plus className="w-5! h-5!" />
          </div>

          <span className="text-base">Quick create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className=" " showCloseButton={false}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row items-center justify-between h-max mb-6">
              <DialogClose className="">
                <Button variant={"secondary"} className="rounded-full">
                  <ArrowLeft />
                </Button>
              </DialogClose>
              <DialogClose>
                <Button className="rounded-full px-5 py-3 w-max">
                  Create items
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name={`name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" {...field} className="flex-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`price`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Price"
                        {...field}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCreationDialog;
