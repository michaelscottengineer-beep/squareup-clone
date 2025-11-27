import { Button } from "@/components/ui/button";

import { Folder, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import ItemFormDialog from "./ItemFormDialog";

import type { TItem } from "@/types/item";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef } from "react";

interface AssignItemsDialogProps {
  onSubmit?: (items: TItem[]) => void;
}

function AssignItemsDialog({ onSubmit }: AssignItemsDialogProps) {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleChangeItem = (items: TItem[]) => {
    onSubmit?.(items);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant={"link"} className="rounded-full p-0">
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className=" " showCloseButton={false}>
          <DialogHeader className="flex flex-row items-center justify-between h-max">
            <DialogClose className="">
              <Button variant={"secondary"} className="rounded-full">
                <X />
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="rounded-full px-5 py-3 w-max"
                onClick={() => {
                  submitButtonRef.current?.click();
                }}
              >
                Assign Items
              </Button>
            </DialogClose>
          </DialogHeader>

          {/* Main heading */}
          <h1 className="text-2xl font-bold mb-4">Assign Items</h1>

          {/* Description text with learn more link */}
          <p className="text-sm text-muted-foreground mb-8">
            Create an item below to get started. Items can be managed from your
            Item Library.{" "}
            <a
              href="#"
              className="underline text-foreground font-medium hover:text-foreground/80"
            >
              Learn more
            </a>
          </p>

          {/* <CreateItemForm /> */}
          {/* Items section */}
          <div className="space-y-4">
            <h2 className="font-semibold text-base">Items</h2>
            <Separator />

            <ItemFormDialog />

            <ListItem
              items={data ?? []}
              submitButtonRef={submitButtonRef}
              onChangeCallback={handleChangeItem}
            />
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

interface FormValues {
  items: TItem[];
}

const ListItem = ({
  items,
  onChangeCallback,
  submitButtonRef,
}: {
  items: TItem[];
  submitButtonRef?: React.Ref<HTMLButtonElement>;
  onChangeCallback?: (items: TItem[]) => void;
}) => {
  console.table(items);

  const form = useForm<FormValues>({
    defaultValues: {
      items,
    },
  });

  const { control, handleSubmit } = form;

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data, "checked data");
    const filteredItems = data.items.filter((it) => !!it.selected);
    console.log("filteredItems", filteredItems);
    onChangeCallback?.(filteredItems);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3 w-full">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <div className="bg-red-500 h-5 w-5"></div>
                <div className="">{field.name}</div>
              </div>

              <FormField
                control={control}
                name={`items.${index}.selected`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        defaultChecked={!!field.value}
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" ref={submitButtonRef} className="hidden">
          alskjf
        </Button>
      </form>
    </Form>
  );
};

export default AssignItemsDialog;
