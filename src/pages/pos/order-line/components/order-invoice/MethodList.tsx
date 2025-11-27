import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import usePosOrderLineState, {
} from "@/stores/use-pos-order-line-state";
import { BsCashCoin } from "react-icons/bs";
import { GoCreditCard } from "react-icons/go";
import { BiScan } from "react-icons/bi";

const methods = [
  { icon: BsCashCoin, label: "cash" },
  { icon: GoCreditCard, label: "card" },
  { icon: BiScan, label: "scan" },
];


const MethodList = () => {
  const setPaymentMethod = usePosOrderLineState(
    (state) => state.setPaymentMethod
  );
  const paymentMethod = usePosOrderLineState((state) => state.paymentMethod);

  return (
    <div className="flex items-center justify-center flex-wrap gap-4">
      {methods.map((item, i) => {
        const isSelected = paymentMethod === item.label;
        return (
          <Button
            className={cn(
              "border rounded-md flex-1 text-gray-400 items-center flex gap-2 bg-transparent hover:bg-transparent",
              {
                "border-primary text-primary": isSelected,
              }
            )}
            onClick={() => setPaymentMethod(item.label)}
          >
            <item.icon
              className={cn("", {
                "text-primary": isSelected,
              })}
            />
            <span
              className={cn("", {
                "text-black": isSelected,
              })}
            >
              {item.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default MethodList;