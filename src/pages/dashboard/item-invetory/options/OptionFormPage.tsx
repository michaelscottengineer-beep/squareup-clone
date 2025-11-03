import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, Plus, Trash2, X } from "lucide-react";
import type { TOption, TOptionListItem } from "@/types/option";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useParams } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import { get, push, ref, set } from "firebase/database";
import { toast } from "sonner";

export default function OptionFormPage() {
  const { optionId } = useParams(); // Destructure to get the 'slug' directly
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const form = useForm<TOption>({
    defaultValues: {
      basicInfo: {
        name: "T-Shirt sizes",
        displayName: "Size",
        type: "text",
      },
      list: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "list",
  });

  const optionType = form.watch("basicInfo.type");

  const { data: option } = useQuery({
    queryKey: ["options", "details", optionId],
    queryFn: async () => {
      const optionRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allOptions", optionId)
      );
      const data = await get(optionRef);
      return data;
    },
    enabled: !!optionId,
  });

  const mutation = useMutation({
    mutationFn: async (data: TOption) => {
      let currentOptionId = optionId ?? null;
      const prefix = parseSegments("restaurants", restaurantId, "allOptions");

      if (!currentOptionId) {
        const newRef = await push(ref(db, prefix));
        currentOptionId = newRef.key;
      }

      const basicInfoRef = ref(
        db,
        parseSegments(prefix, currentOptionId, "basicInfo")
      );
      const listRef = ref(db, parseSegments(prefix, currentOptionId, "list"));

      const promise = [
        await set(basicInfoRef, data.basicInfo),
        await set(
          listRef,
          data.list.map((item) => {
            if (!item.color) item.color = "#000";
            return item;
          })
        ),
      ];

      return Promise.all(promise);
    },
    onSuccess: () => {
      toast.success(`${optionId ? "Edit" : "Created"} successfully`);
    },
    onError: (err) => {
      toast.error(`${optionId ? "Edit" : "Created"} error`, {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (!optionId || !option) return;
    console.log("your option edit", option);
    const ret = option.val() as TOption;
    if (!ret) return;
    form.reset({ ...ret, id: optionId });
    console.log(ret, "reset");
  }, [option]);

  const onSubmit = (data: TOption) => {
    console.log(data);
    mutation.mutate(data);
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

            <div className="p-6 ">
              {/* Details Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Details</h2>
                <div className="bg-white border rounded-lg">
                  {/* Option Set Name */}
                  <div className="border-b">
                    <div className="grid grid-cols-[150px_1fr] gap-8 items-center p-4">
                      <div className="flex items-center gap-2 justify-between">
                        <Label className="font-medium text-sm">
                          Option set name
                        </Label>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <FormField
                        control={form.control}
                        name="basicInfo.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Name"
                                className="w-full h-12 text-base focus-visible:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="border-b">
                    <div className="grid grid-cols-[150px_1fr] gap-8 items-center p-4">
                      <div className="flex items-center gap-2 justify-between">
                        <Label className="font-medium text-sm">
                          Display name
                        </Label>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <FormField
                        control={form.control}
                        name="basicInfo.displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Display name"
                                className="w-full h-12 text-base focus-visible:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Option Set Type */}
                  <div>
                    <div className="grid grid-cols-[150px_1fr] gap-8 items-start p-4">
                      <div className="flex items-center gap-2 pt-2 justify-between">
                        <Label className="font-medium text-sm">
                          Option set type
                        </Label>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <Controller
                        control={form.control}
                        name="basicInfo.type"
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="text" id="text" />
                              <Label
                                htmlFor="text"
                                className="text-sm font-normal cursor-pointer"
                              >
                                Text
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="text-color"
                                id="text-color"
                              />
                              <Label
                                htmlFor="text-color"
                                className="text-sm font-normal cursor-pointer"
                              >
                                Text and color
                              </Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Options Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Options</h2>
                <div className="rounded-lg">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={cn(
                        " py-3 px-2 border-b  gap-4 grid grid-cols-[1fr_auto]",
                        {
                          "grid-cols-[110px_1fr_auto]":
                            optionType === "text-color",
                        }
                      )}
                    >
                      {optionType === "text-color" && (
                        <FormField
                          control={form.control}
                          name={`list.${index}.color`}
                          render={({ field: { value, ...field } }) => (
                            <FormItem>
                              <FormControl>
                                <InputGroup className="h-10 px-2">
                                  <InputGroupInput
                                    placeholder="Color"
                                    value={value ?? "#333"}
                                    {...field}
                                  />

                                  <InputGroupAddon
                                    align={"inline-start"}
                                    className="w-5 h-5 p-0 cursor-pointer"
                                  >
                                    <InputGroupInput
                                      type="color"
                                      value={value ?? "#333"}
                                      className="w-5 h-5 p-0"
                                      {...field}
                                    />
                                  </InputGroupAddon>
                                </InputGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name={`list.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Name"
                                className="h-10"
                                {...field}
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

                  <AddOption
                    type={optionType}
                    onChange={(data) => {
                      if (data) append(data);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AppOptionProps {
  type: string;
  onChange?: (data?: TOptionListItem) => void;
}

const AddOption = ({ type, onChange }: AppOptionProps) => {
  const [color, setColor] = useState<undefined | string>(undefined);
  const [name, setName] = useState("");

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (name.trim().length > 0) {
      onChange?.({
        name,
        color,
      });
      setName("");
      setColor(undefined);
    }
  };

  console.log("color", color);
  return (
    <div
      className={cn("mt-4", {
        "grid grid-cols-[110px_1fr] gap-4": type === "text-color",
      })}
    >
      {type === "text-color" && (
        <InputGroup className="h-10 px-2">
          <InputGroupInput
            id="color"
            placeholder="Color"
            value={color ?? "#000"}
            onChange={(e) => setColor(e.target.value)}
          />

          <InputGroupAddon
            align={"inline-start"}
            className="w-5 h-5 p-0 cursor-pointer"
          >
            <InputGroupInput
              type="color"
              value={color ?? "#000"}
              className="w-5 h-5 p-0 cursor-pointer rounded-sm"
              onChange={(e) => setColor(e.target.value)}
            />
          </InputGroupAddon>
        </InputGroup>
      )}
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="h-10"
        onBlur={handleBlur}
      />
    </div>
  );
};
