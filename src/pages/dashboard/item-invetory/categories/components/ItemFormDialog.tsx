import { Button } from "@/components/ui/button";

import { ArrowLeft, Folder, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateItemForm from "./CreateItemForm";
import { useEffect, useRef } from "react";
import type { TItem, TItemForm } from "@/types/item";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, onValue, push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { toast } from "sonner";


function ItemFormDialog() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const itemsRef = ref(db, "/restaurants/" + restaurantId + "/allItems");
      const doc = await get(itemsRef);
      return Object.entries(doc.val() as { [key: string]: TItem }).map(
        ([id, val]) => ({
          ...val,
          id,
        })
      ) as TItem[];
    },
    enabled: !!restaurantId,
  });

  const mutation = useMutation({
    mutationFn: async (data: { items: TItemForm[] }) => {
      const itemsRef = ref(db, "/restaurants/" + restaurantId + "/allItems");
      const promise = data.items.map(
        async (item) => await set(push(itemsRef), item)
      );

      return Promise.all(promise);
    },
    onSuccess: (data) => {
      toast.success("Insert items successfully");
    },
    onError: (err) => {
      console.error("insert itesm error", err);
    },
  });
  const handleSubmit = (data: { items: TItemForm[] }) => {
    mutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-full justify-start gap-3 h-auto py-3 px-4 hover:bg-muted"
        >
          <div className="p-2 h-max w-max bg-muted rounded-md">
            <Plus className="w-5! h-5!" />
          </div>

          <span className="text-base">Create new items</span>
        </Button>
      </DialogTrigger>
      <DialogContent className=" " showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between h-max">
          <DialogClose className="">
            <Button variant={"secondary"} className="rounded-full">
              <ArrowLeft />
            </Button>
          </DialogClose>
          <Button
            className="rounded-full px-5 py-3 w-max"
            onClick={() => {
              buttonRef.current?.click();
            }}
          >
            Create items
          </Button>
        </DialogHeader>

        <CreateItemForm
          submitButton={{
            ref: buttonRef,
          }}
          onSubmitCallback={handleSubmit}
        />


      </DialogContent>
    </Dialog>
  );
}


export default ItemFormDialog;
