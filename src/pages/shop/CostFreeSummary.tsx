import React, { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TCheckoutFormDataValues } from "@/types/checkout";
import useCart from "@/stores/use-cart";

const CostFreeSummary = ({
  form,
}: {
  form: UseFormReturn<TCheckoutFormDataValues, any, TCheckoutFormDataValues>;
}) => {
  const selectedTip = form.watch("gratuity") ?? "10%";
  const items = useCart((state) => state.items);

  // const [selectedTip, setSelectedTip] = useState("10%");
  const [customTip, setCustomTip] = useState("");

  const subTotal = useMemo(() => {
    const ret = items.reduce((acc, item) => {
      const selectedModifier = item.modifiers?.[0]?.list?.[0];

      const total = Number(item.price) * item.amount;
      const totalWithModifiers =
        total +
        (selectedModifier ? Number(selectedModifier.price) * item.amount : 0);
      const totalWithPromotion =
        totalWithModifiers - (totalWithModifiers * 20) / 100;

      return acc + totalWithPromotion;
    }, 0);
    form.setValue("feeSummary.subTotal", ret);
    return ret;
  }, [items]);

  const estimatedTax = form.getValues("feeSummary.tax");
  const serviceFee = form.getValues("feeSummary.serviceFee");
  const onlineProcessing = form.getValues("feeSummary.paymentProcessingFee");

  const calculateTip = () => {
    if (selectedTip === "Other" && customTip) {
      return parseFloat(customTip) || 0;
    }
    if (selectedTip && selectedTip !== "Other") {
      const percentage = parseInt(selectedTip) / 100;
      return subTotal * percentage;
    }
    return 0;
  };

  const tipAmount = calculateTip();
  const total =
    subTotal + estimatedTax + tipAmount + serviceFee + onlineProcessing;

  useEffect(() => {
    form.setValue("feeSummary.tip", tipAmount);
    form.setValue("feeSummary.total", total);
  }, [total, tipAmount]);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Fee Summary</h3>
      <div className="h-0.5 bg-black w-16"></div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <TooltipProvider>
          {/* Sub Total */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sub Total</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total before tax and fees</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium">${subTotal.toFixed(2)}</span>
          </div>

          {/* Estimated Tax */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Estimated Tax</span>
            <span className="text-sm font-medium">
              ${estimatedTax.toFixed(2)}
            </span>
          </div>

          {/* Tip */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Tip (Optional)</span>
            <span className="text-sm font-medium">${tipAmount.toFixed(2)}</span>
          </div>

          {/* Service Fee */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">Service Fee</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fee for processing your order</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium">
              ${serviceFee.toFixed(2)}
            </span>
          </div>

          {/* Online Payment Processing */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm">Online Payment Processing</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Payment processing fee</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-medium">
              ${onlineProcessing.toFixed(2)}
            </span>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CostFreeSummary;
