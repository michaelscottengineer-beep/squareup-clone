"use client";

import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { TItem, TItemForm } from "@/types/item";

interface FormValues {
  items: TItemForm[];
}

interface CreateItemFormProps {
  onSubmitCallback?: (data: FormValues) => void;
  submitButton: Pick<React.ComponentProps<"button">, "ref">;
}

export default function CreateItemForm({
  onSubmitCallback,
  submitButton,
}: CreateItemFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      items: [{ name: "", price: "" }],
    },
  });
  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: FormValues) => {
    onSubmitCallback?.(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Items Table */}
        <div className="mb-6">
          {/* Column Headers */}
          <div className="flex gap-4 mb-4 px-1">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Item Name</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Price</p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Item Rows */}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center">
                <FormField
                  control={control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="" {...field} className="flex-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="" {...field} className="flex-1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                  className="h-10 w-10 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Item Button */}
        <Button
          variant="ghost"
          className="text-foreground font-medium gap-2 pl-0 hover:bg-transparent"
          type="button"
          onClick={() =>
            append({
              name: "",
              price: "",
              categories: [],
              description: "",
              image: "",
              type: "",
              modifiers: [],
              selected: false,
            })
          }
        >
          <Plus className="h-5 w-5" />
          <span className="underline">Add Item</span>
        </Button>

        <Button
          type="submit"
          className="hidden"
          ref={submitButton.ref}
        ></Button>
      </form>
    </Form>
  );
}
