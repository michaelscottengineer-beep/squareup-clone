import { useMutation } from "@tanstack/react-query";
import { increment, push, ref, set, update } from "firebase/database";
import { parseSegments } from "@/utils/helper";
import { db } from "@/firebase";

import { Info, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import type { TOrderDocumentData } from "@/types/checkout";
import { Separator } from "@/components/ui/separator";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import imgbbService from "@/services/imggbb.service";
import RatingSelector from "./RatingSelector";
import ImageUploadFrame from "./ImageUploadFrame";

type FormValues = {
  content: string;
  rate: number;
  itemId: string;
  images: { id: string; value: string }[];
};

const RatingForm = ({
  order,
  onSubmitCallback,
}: {
  order: TOrderDocumentData;
  onSubmitCallback?: (data: FormValues) => void;
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      content: "",
      rate: 5,
      images: [{ id: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const path = parseSegments(
        "restaurants",
        order.basicInfo.restaurantId,
        "allRatings"
      );
      const converterImages = data.images
        .filter((img) => img.value)
        .map(async (img) => {
          const base64Data = img.value.split(",")[1];
          const data = await imgbbService.upload(base64Data);
          return data.image.url;
        });

      const images = await Promise.all(converterImages);
      const newKey = (await push(ref(db, path))).key;

      const updates: { [key: string]: any } = {};

      const ratingPath = parseSegments(
        "restaurants",
        order.basicInfo.restaurantId,
        "statistics",
        "ratingInfo"
      );
      updates[parseSegments(ratingPath, `${data.rate}star`)] = increment(1);
      updates[parseSegments(ratingPath, "totalRating")] = increment(1);

      updates[parseSegments(path, newKey, "basicInfo")] = {
        ...data,
        images,
      };

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Review successfully!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Review error!");
    },
  });
  const onSubmit = (data: FormValues) => {
    console.log(data);
    onSubmitCallback?.(data);
    mutation.mutate(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name={`itemId`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12! py-2 focus-visible:ring-1">
                    <SelectValue
                      placeholder={"Select the review item"}
                      className="h-max p-0"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(order.cartItems).map(([id, item]) => {
                      return (
                        <SelectItem key={id} value={id}>
                          <img
                            alt="item img"
                            src={item.image}
                            className="w-10 rounded-md object-cover aspect-square h-10"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{item.name}</span>
                            <div className="text-sm gap-1 flex text-foreground  ">
                              {item.price} x {item.quantity}
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`content`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Say whatever you are thinking..."
                  {...field}
                  className="flex-1 focus-visible:ring-[1.5px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex flex-wrap items-center gap-4">
          {fields.map((field, i) => {
            return (
              <FormField
                key={field.id}
                control={form.control}
                name={`images.${i}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <ImageUploadFrame
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            if (val?.trim() && val?.length) {
                              append({
                                id: (i + 1).toString(),
                                value: "",
                              });
                            }
                          }}
                        />
                        {field.value && (
                          <Button
                            className="rounded-full absolute top-0 right-0 h-max w-max min-w-max max-w-max p-0! "
                            variant={"destructive"}
                            onClick={() => remove(i)}
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <FormField
          control={form.control}
          name={`rate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating Score</FormLabel>
              <FormControl>
                <RatingSelector {...field} onValueChange={field.onChange} />
              </FormControl>
              <FormDescription className="text-xs flex items-center gap-2">
                <Info size={14} />
                Click on the Star to set the score
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={mutation.isPending}>Submit</Button>
      </form>
    </Form>
  );
};

export default RatingForm;
