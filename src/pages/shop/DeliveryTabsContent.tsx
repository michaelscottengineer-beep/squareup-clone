import { useForm, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TCheckoutFormDataValues } from "@/types/checkout";

const DeliveryTabsContent = ({
  form,
}: {
  form: UseFormReturn<TCheckoutFormDataValues, any, TCheckoutFormDataValues>;
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className=" my-4 space-y-6">
      {/* Table Number */}

      {/* Your Name */}
      <div className="space-y-2">
        <Label htmlFor="yourName" className="text-sm font-normal text-gray-700">
          Your Name
        </Label>
        <div className="relative">
          <Input
            id="yourName"
            placeholder="Your Name"
            {...register("delivery.yourName", { required: true })}
            className="border-2 border-orange-400 rounded-lg h-12 pr-10"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Mobile Phone Number */}
      <div className="space-y-2">
        <Label
          htmlFor="phoneNumber"
          className="text-sm font-normal text-gray-700"
        >
          Mobile Phone Number
        </Label>
        <div className="relative">
          <Input
            id="phoneNumber"
            placeholder="Mobile Phone Number"
            {...register("delivery.phoneNumber", { required: true })}
            className="border-2 border-orange-400 rounded-lg h-12 pr-10"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs text-gray-500">
          You will receive receipt & order status at this number
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Delivery Info</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name={`delivery.deliveryInfo.restaurantAddress`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="flex-1 h-14" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <YourAddress form={form} />

          <FormField
            control={form.control}
            name={`delivery.deliveryInfo.note`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes for Driver</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes for Driver"
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
            name={`delivery.deliveryInfo.dropOffOption`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes for Driver</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? "hand-it-to-me"}
                    className="flex items-center gap-2"
                  >
                    <Label>
                      <RadioGroupItem value={"hand-it-to-me"} />
                      <span className="font-normal">Hand-it-to-me</span>
                    </Label>

                    <Label>
                      <RadioGroupItem value={"leave-at-door"} />
                      <span className="font-normal">Leave it at my door</span>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

    </div>
  );
};

const YourAddress = ({
  form,
}: {
  form: UseFormReturn<TCheckoutFormDataValues, any, TCheckoutFormDataValues>;
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Your Address</FormLabel>
      <FormField
        control={form.control}
        name={`delivery.deliveryInfo.yourAddress.streetAddress`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Street Address"
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
        name={`delivery.deliveryInfo.yourAddress.receivedAt`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Apt, Suite, Unit, etc."
                {...field}
                className="flex-1 h-14"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name={`delivery.deliveryInfo.yourAddress.city`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="City"
                    {...field}
                    className="flex-1 h-14"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="">
          <FormField
            control={form.control}
            name={`delivery.deliveryInfo.yourAddress.state`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="State"
                    {...field}
                    className="flex-1 h-14"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name={`delivery.deliveryInfo.yourAddress.zip`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Zip" {...field} className="flex-1 h-14" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
export default DeliveryTabsContent;
