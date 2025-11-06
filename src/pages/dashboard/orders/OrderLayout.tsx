import { DataTable } from "@/components/ui/data-table";
import React, { useState } from "react";
import type { TCartItem, TItem } from "@/types/item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
} from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowLeft, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
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
import type {
  TOrder,
  TOrderCartItem,
  TOrderDocumentData,
} from "@/types/checkout";
import { orderColumns } from "./order-column";

const OrderLayout = () => {
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const [shippingMethod, setShippingMethod] = useState("all");

  const { data: items, isLoading } = useQuery({
    queryKey: ["allOrders", shippingMethod],
    queryFn: async () => {
      try {
        const path = parseSegments("restaurants", restaurantId, "allOrders");

        const ordersRef = ref(db, path);
        let qr = null;
        if (shippingMethod !== "all")
          qr = query(
            ordersRef,
            orderByChild("basicInfo/shippingMethod"),
            equalTo(shippingMethod)
          );

        const snap = await get(qr ?? ordersRef);

        return snap.val()
          ? convertFirebaseArrayData<TOrderDocumentData>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!restaurantId,
  });

  if (isLoading) return <div>Loading items...</div>;

  console.log("orders", items);
  return (
    <div className="px-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-4 max-w-[300px]">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                className="rounded-full"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Select defaultValue="all" onValueChange={(val) => setShippingMethod(val)}>
            <SelectTrigger>
              Type <span className="font-semibold">{shippingMethod}</span>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
              <SelectItem value="Dine In">Dine In</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2  mb-3">
          {/* <QuickCreationDialog /> */}
          <Button
            className="rounded-full px-5 py-3"
            onClick={() => navigate("/dashboard/items/library/new")}
          >
            Create item
          </Button>
        </div>
      </div>

      {!items?.length ? (
        <div>No orders found</div>
      ) : (
        <DataTable
          columns={orderColumns}
          data={items.map((r) => ({
            ...r,
            cartItems: convertFirebaseArrayData<TOrderCartItem>(r?.cartItems ?? {}),
          }))}
        />
      )}
    </div>
  );
};

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

export default OrderLayout;
