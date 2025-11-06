"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload, Settings2, Heart, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import type { TItem } from "@/types/item";
import { parseSegments } from "@/utils/helper";
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
import UploadImageArea from "./UploadImageArea";

export default function NewItemCreationPage() {
  const { itemId } = useParams(); // Destructure to get the 'slug' directly
  const navigate = useNavigate();
  const form = useForm<TItem>({
    defaultValues: {
      categories: [],
      description: "",
      image: "",
      name: "",
      price: "",
      selected: false,
      type: "",
    },
  });

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: item } = useQuery({
    queryKey: ["items", "details", itemId],
    queryFn: async () => {
      const itemRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allItems", itemId)
      );
      const data = await get(itemRef);
      return data;
    },
    enabled: !!itemId,
  });

  const mutation = useMutation({
    mutationFn: async (formData: TItem) => {
      let currentItemId = itemId ?? null;
      const prefix = parseSegments("/restaurants/", restaurantId);
      const itemInfo = { ...formData };

      if (!currentItemId) {
        const itemsRef = ref(db, parseSegments(prefix, "allItems"));
        const newItemRef = await push(itemsRef, formData);
        const newItemId = newItemRef.key;
        currentItemId = newItemId;
      } else {
        const itemsRef = ref(
          db,
          parseSegments(prefix, "allItems", currentItemId)
        );
        await set(itemsRef, formData);
      }

      delete (itemInfo as any).categories;
      delete (itemInfo as any).modifiers;

      const promise = formData.categories.map(async (cate) => {
        const segments = parseSegments(
          prefix,
          "allGroups",
          cate.id,
          "items",
          currentItemId
        );
        const itemCategoryRef = ref(db, segments);
        console.log({
          ...itemInfo,
          selected: true,
        });
        return await set(itemCategoryRef, {
          ...itemInfo,
          selected: true,
        });
      });

      const promise2 = formData.modifiers.map(async (modifier) => {
        const segments = parseSegments(
          prefix,
          "allModifiers",
          modifier.id,
          "items",
          currentItemId
        );
        const itemModifierRef = ref(db, segments);

        return await set(itemModifierRef, {
          ...itemInfo,
        });
      });
      return Promise.all([...promise, ...promise2]);
    },
    onSuccess: () => {
      toast.success(`${itemId ? "Saved" : "Created"} items successfully`);
    },
    onError: (err) => {
      toast.error(`${itemId ? "Saved" : "Created"} error`, {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (!itemId || !item) return;
    console.log(item);
    const ret = item.val() as TItem;
    if (!ret) return;
    form.reset({ ...ret });
    useItemCreationFormData.getState().setCategories(ret.categories ?? []);
    useItemCreationFormData.getState().setModifiers(ret.modifiers ?? []);
    console.log(ret, "reset");
  }, [item]);

  const onSubmit = (data: TItem) => {
    console.log(data);
    console.log("cate g", useItemCreationFormData.getState().modifiers);
    console.log("cate g", useItemCreationFormData.getState().categories);
    mutation.mutate({
      ...data,
      categories: useItemCreationFormData.getState().categories,
      modifiers: useItemCreationFormData.getState().modifiers,
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

                <div>
                  <ModifierSection />
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
