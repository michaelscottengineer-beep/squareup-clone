import { Button } from "@/components/ui/button";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const shippingButtonVariants = cva(
  "flex h-max w-max border-b-2 border-b-transparent items-start gap-2 text-muted-foreground hover:bg-transparent bg-transparent",
  {
    variants: {
      active: {
        true: "text-black border-b-primary rounded-bl-none rounded-br-none",
        false: "",
      },
      variant: {
        tabs: "rounded-lg  flex-row",
        false: "flex-col ",
      },
    },
    defaultVariants: {
      active: false,
      variant: false,
    },
  }
);

interface ShippingButtonProps
  extends VariantProps<typeof shippingButtonVariants> {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const ShippingButton = ({
  icon: Icon,
  label,
  active,
  onClick,
}: ShippingButtonProps) => (
  <Button
    className={shippingButtonVariants({
      active,
      className: cn({
        "text-black border-b-primary rounded-bl-none rounded-br-none": active,
      }),
    })}
    onClick={onClick}
  >
    <Icon className="h-6 w-6" />
    <span>{label}</span>
  </Button>
);

const shippingMethodSelectorVariants = cva(
  "kind-of-order flex items-center gap-4 my-2 px-1",
  {
    variants: {
      variant: {
        tabs: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: false,
    },
  }
);

interface ShippingMethodSelectorProps
  extends VariantProps<typeof shippingMethodSelectorVariants> {
  children?: React.ReactNode;
}

const ShippingMethodSelector = ({ variant }: ShippingMethodSelectorProps) => {
  const data = [
    { icon: MdOutlineTableRestaurant, label: "Dine In" },
    { icon: PiHandWavingBold, label: "Pickup" },
    { icon: IoCarSportOutline, label: "Delivery" },
  ];
  const [selected, setSelected] = useState(data[0]);

  const Wrapper = variant === "tabs" ? TabsList : "div";

  return (
    <Wrapper
      className={shippingMethodSelectorVariants({ variant, className: "" })}
    >
      {data.map((item) => {
        const Button = (
          <ShippingButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={item.label === selected.label}
            onClick={() => setSelected(item)}
          />
        );

        return variant === "tabs" ? (
          <TabsTrigger asChild value={item.label}>
            {Button}
          </TabsTrigger>
        ) : (
          <Fragment>{Button}</Fragment>
        );
      })}
    </Wrapper>
  );
};

export default ShippingMethodSelector;
