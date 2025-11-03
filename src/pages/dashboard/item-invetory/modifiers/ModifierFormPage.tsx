import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { get, push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import { toast } from "sonner";
import type { TModifier } from "@/types/modifier";
import { cn } from "@/lib/utils";

// const formSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   displayName: z.string().min(1, "Display name is required"),
//   modifierType: z.string(),
//   location: z.string(),
//   modifiers: z.array(
//     z.object({
//       name: z.string(),
//       price: z.string(),
//       hideOnline: z.boolean(),
//       preSelect: z.boolean(),
//       availability: z.boolean(),
//     })
//   ),
//   requireSelection: z.boolean(),
//   allowMultiple: z.boolean(),
// });

// type FormValues = z.infer<typeof formSchema>;

export default function ModifierFormPage() {
  const { modifierId } = useParams(); // Destructure to get the 'slug' directly
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const form = useForm<TModifier>({
    defaultValues: {
      basicInfo: {
        name: "",
        displayName: "",
        kind: "list",
        locations: [],
      },
      list: [
        {
          name: "",
          price: "0.00",
          hideOnline: false,
          preSelect: false,
          inStock: true,
        },
      ],
      // requireSelection: false,
      // allowMultiple: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "list",
  });

  const watchedKind = form.watch("basicInfo.kind");

  const { data: modifier } = useQuery({
    queryKey: ["modifiers", "details", modifierId],
    queryFn: async () => {
      const modifierRef = ref(
        db,
        parseSegments(
          "/restaurants/",
          restaurantId,
          "/allModifiers",
          modifierId
        )
      );
      const data = await get(modifierRef);
      return data;
    },
    enabled: !!modifierId,
  });

  const mutation = useMutation({
    mutationFn: async (data: TModifier) => {
      let currentModifierId = modifierId ?? null;
      const prefix = parseSegments("restaurants", restaurantId, "allModifiers");

      if (!currentModifierId) {
        const newRef = await push(ref(db, prefix));
        currentModifierId = newRef.key;
      }

      const basicInfoRef = ref(
        db,
        parseSegments(prefix, currentModifierId, "basicInfo")
      );
      const listRef = ref(db, parseSegments(prefix, currentModifierId, "list"));

      const promise = [
        await set(basicInfoRef, data.basicInfo),
        await set(
          listRef,
          data.list
        ),
      ];

      return Promise.all(promise);
    },
    onSuccess: () => {
      toast.success("Created successfully");
    },
    onError: () => {
      toast.error("Created error");
    },
  });

  useEffect(() => {
    if (!modifierId || !modifier) return;
    console.log(modifier);
    const ret = modifier.val() as TModifier;
    if (!ret) return;
    form.reset({ ...ret });
    console.log(ret, "reset");
  }, [modifier]);

  const onSubmit = (data: TModifier) => {
    console.log(data);
    mutation.mutate(data);
  };

  console.log("kind", form.getValues("basicInfo.kind"));
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col px-10 gap-6"
          >
            <div className="flex flex-row items-center justify-between h-max mb-4 ">
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
                Save
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-6 basis-0">
              <div>
                <h1 className="font-semibold text-2xl mb-8">
                  {modifierId ? "Edit item" : "Create modifier set"}
                </h1>
              </div>

              {/* Name Field */}
              <FormField
                control={form.control}
                name="basicInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="w-full h-14 text-base focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Name Field */}
              <FormField
                control={form.control}
                name="basicInfo.displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Display name"
                        className="h-14 focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dropdowns Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="basicInfo.kind"
                  render={({ field }) => (
                    <FormItem className="w-ful">
                      <FormLabel className="text-sm font-medium">
                        What kind of modifier set is this?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="list">List modifier</SelectItem>
                          <SelectItem value="single">
                            Single modifier
                          </SelectItem>
                          <SelectItem value="multiple">
                            Multiple modifier
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="locations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Locations
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="zm">z-m</SelectItem>
                          <SelectItem value="location1">Location 1</SelectItem>
                          <SelectItem value="location2">Location 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              {/* Modifier List Section */}
              <div
                className={cn("mt-8", {
                  hidden: watchedKind !== "list",
                })}
              >
                <h2 className="text-xl font-bold mb-4">Modifier list</h2>

                {/* Table Header */}
                <div className="grid grid-cols-[40px_1fr_150px_100px_100px_120px_40px] gap-4 mb-4 text-sm font-medium">
                  <div></div>
                  <div>Name</div>
                  <div>Price</div>
                  <div>Hide online</div>
                  <div>Pre-select</div>
                  <div>Availability</div>
                  <div></div>
                </div>

                {/* Modifier Rows */}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[40px_1fr_150px_100px_100px_120px_40px] gap-4 items-center mb-3 pb-3 border-b"
                  >
                    <div className="flex items-center justify-center">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>

                    <FormField
                      control={form.control}
                      name={`list.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="New modifier"
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`list.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <Input className="h-10 pl-7" {...field} />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`list.${index}.hideOnline`}
                      render={({ field }) => (
                        <FormItem className="flex justify-center">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-5 h-5 rounded border-gray-300"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`list.${index}.preSelect`}
                      render={({ field }) => (
                        <FormItem className="flex justify-center">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-5 h-5 rounded border-gray-300"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`list.${index}.inStock`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <span className="text-sm">In stock</span>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-center">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    append({
                      id: Math.random().toString(),
                      name: "",
                      price: "0.00",
                      hideOnline: false,
                      preSelect: false,
                      inStock: true,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Modifier
                </Button>
              </div>

              {/* Selection Rules Section */}
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-2">Selection rules</h2>
                <p className="text-sm text-gray-600 mb-4">
                  These settings are the default for the modifier set. You can
                  override them for a specific item after applying the set.{" "}
                  <a href="#" className="text-blue-600 underline">
                    Learn more
                  </a>
                </p>

                {/* <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="requireSelection"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between py-3 border-b">
                        <FormLabel className="text-base font-normal cursor-pointer">
                          Require a selection
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowMultiple"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between py-3 border-b">
                        <FormLabel className="text-base font-normal cursor-pointer">
                          Allow more than one modifier to be selected
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div> */}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
