import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload, Settings2, Heart, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, push, ref, set, update } from "firebase/database";
import { db } from "@/firebase";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import type { TItem } from "@/types/item";
import { initFirebaseUpdateVariable, parseSegments } from "@/utils/helper";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";
import CategoriesSection from "./components/CategoriesSection";
import { toast } from "sonner";
import ModifierSection from "./ModifierSection";
import UploadImageArea from "@/components/UploadImageArea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PromotionSection from "./PromotionSection";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";

export default function NewItemCreationPage() {
  const { itemId } = useParams(); // Destructure to get the 'slug' directly
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<TItem>({
    defaultValues: {
      categories: [],
      description: "",
      image: "",
      name: "",
      price: "",
      selected: false,
      type: "",

      discount: {
        value: 0,
        unit: "%",
      },
    },
  });

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, itemId });

  const { data: item } = useQuery({
    queryKey: ["restaurants", restaurantId, "allItems", itemId],
    queryFn: async () => {
      const itemRef = ref(db, keys.detailedItem());
      const data = await get(itemRef);
      return data;
    },
    enabled: !!itemId,
  });

  const mutation = useMutation({
    mutationFn: async (formData: TItem) => {
      // let currentItemId = itemId ?? null;
      const prefix = parseSegments("/restaurants/", restaurantId);
      const itemInfo = { ...formData };

      let currentItemId = null;
      if (itemId) currentItemId = itemId;
      else {
        const newItemRef = await push(keys.allItemsRef());
        currentItemId = newItemRef.key;
      }

      keys.setParams({ itemId: currentItemId });
      const updates = initFirebaseUpdateVariable();

      updates[keys.detailedItem()] = formData;
      // await set(keys.detailedItemRef(), formData);

      // delete (itemInfo as any).categories;
      // delete (itemInfo as any).modifiers;
      // delete (itemInfo as any).promotions;

      for (const cate of formData.categories) {
        const segments = parseSegments(
          prefix,
          "allGroups",
          cate.id,
          "items",
          currentItemId
        );

        updates[segments] = {
          ...itemInfo,
          selected: true,
        };
      }

      for (const modifier of formData.modifiers) {
        const segments = parseSegments(
          prefix,
          "allModifiers",
          modifier.id,
          "items",
          currentItemId
        );

        updates[segments] = itemInfo;
      }


     for (const promotion of formData.promotions) {
           const segments = parseSegments(
          prefix,
          "allPromotions",
          promotion.id,
          "items",
          currentItemId
        );

        updates[segments] = itemInfo;
      }

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success(`${itemId ? "Saved" : "Created"} items successfully`);
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allItems"],
      });
    },
    onError: (err) => {
      console.error("save error", err);
      toast.error(`${itemId ? "Saved" : "Created"} error`, {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (!itemId || !item) return;
    const ret = item.val() as TItem;
    if (!ret) return;
    form.reset({ ...form.getValues(), ...ret });
    useItemCreationFormData.getState().setCategories(ret.categories ?? []);
    useItemCreationFormData.getState().setModifiers(ret.modifiers ?? []);
    useItemCreationFormData.getState().setPromotions(ret.promotions ?? []);
  }, [item]);

  const onSubmit = (data: TItem) => {
    mutation.mutate({
      ...data,
      categories: useItemCreationFormData.getState().categories,
      modifiers: useItemCreationFormData.getState().modifiers,
      promotions: useItemCreationFormData.getState().promotions,
    });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(o) => {
        if (!o) navigate(-1);
      }}
    >
      <DialogContent
        className="max-w-screen! rounded-none h-screen"
        showCloseButton={false}
      >
        <Form {...form}>
          <form className="w-full  px-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row items-center justify-between h-max mb-4">
              <DialogClose className="">
                <Button
                  variant={"secondary"}
                  className="rounded-full"
                  type="button"
                >
                  <X />
                </Button>
              </DialogClose>
              <Button
                className="rounded-full px-5 py-3 h-max w-max"
                type={"submit"}
              >
                {itemId ? "Save" : "Create item"}
              </Button>
            </div>

            <div>
              <h1 className="font-semibold text-2xl mb-8">
                {itemId ? "Edit item" : "Create item"}
              </h1>
            </div>

            <div className="w-full grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name={`name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="flex-1 h-14"
                        />
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
                          className="flex-1 h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Description"
                          {...field}
                          className="flex-1 h-14"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadImageArea
                          value={field.value ?? ""}
                          onValueChange={(url) => field.onChange(url)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <Select
                              onValueChange={(val) => {
                                field.onChange({
                                  ...field.value,
                                  unit: val,
                                });
                              }}
                            >
                              <SelectTrigger className="outline-none border-none">
                                {field.value?.unit === "currency"
                                  ? "$"
                                  : field.value?.unit}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="%">%</SelectItem>
                                <SelectItem value="$">$</SelectItem>
                              </SelectContent>
                            </Select>
                          </InputGroupAddon>
                          <InputGroupInput
                            value={field.value?.value}
                            onChange={(e) => {
                              field.onChange({
                                ...field.value,
                                value: Number(e.target.value),
                              });
                            }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <ModifierSection />
                </div>

                <div>
                  <PromotionSection />
                </div>
              </div>

              <div>
                <CategoriesSection />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
