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

const PickUpTabsContent = ({
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
            {...register("pickup.yourName", { required: true })}
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
            {...register("pickup.phoneNumber", { required: true })}
            className="border-2 border-orange-400 rounded-lg h-12 pr-10"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs text-gray-500">
          You will receive receipt & order status at this number
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Pickup Info</h3>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-2 text-sm">
            <div>You will pick up at:</div>
            <div className="font-semibold">Test Restaurant [Production]</div>
            <div className="font-semibold">
              75 5th Street NW, Atlanta, GA 30308
            </div>
          </div>

          <FormField
            control={form.control}
            name={`pickup.time`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>When do you want to pick up?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? "ASAP"}
                    className="flex items-center gap-2"
                  >
                    <Label>
                      <RadioGroupItem value={"ASAP"} />
                      <span className="font-normal">ASAP</span>
                    </Label>

                    <Label>
                      <RadioGroupItem value={"Other Time"} />
                      <span className="font-normal">Other Time</span>
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

export default PickUpTabsContent;
