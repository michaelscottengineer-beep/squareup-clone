import React, { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Form } from "@/components/ui/form";
import type { TCheckoutFormDataValues } from "@/types/checkout";

type FormValues = {
  tableNumber: string;
  yourName: string;
  phoneNumber: string;
};

const DineInTabsContent = ({
  form,
}: {
  form: UseFormReturn<TCheckoutFormDataValues, any, TCheckoutFormDataValues>;
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormValues) => {
    console.log(data, "checkout data dinein");
  };
  return (
    <form className=" my-4 space-y-6">
      {/* Table Number */}
      <div className="space-y-2">
        <Label
          htmlFor="tableNumber"
          className="text-sm font-normal text-gray-700"
        >
          Table Number / Area / To Go
        </Label>
        <Input
          id="tableNumber"
          {...register("dineIn.tableNumber", { required: true })}
          className="border-2 border-orange-400 rounded-lg h-12"
        />
      </div>

      {/* Your Name */}
      <div className="space-y-2">
        <Label htmlFor="yourName" className="text-sm font-normal text-gray-700">
          Your Name
        </Label>
        <div className="relative">
          <Input
            id="yourName"
            placeholder="Your Name"
            {...register("dineIn.yourName", { required: true })}
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
            {...register("dineIn.phoneNumber", { required: true })}
            className="border-2 border-orange-400 rounded-lg h-12 pr-10"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <p className="text-xs text-gray-500">
          You will receive receipt & order status at this number
        </p>
      </div>
    </form>
  );
};

export default DineInTabsContent;
