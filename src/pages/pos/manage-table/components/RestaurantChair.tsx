import { cn } from "@/lib/utils";
import { PiChairLight } from "react-icons/pi";

const RestaurantChair = ({
  className,
  status,
}: {
  className?: string;
  status?: string;
}) => {
  return (
    <PiChairLight
      className={cn(
        "size-6!",
        {
          "text-table-status-on-dine-foreground": status === "on dine",
          "text-table-status-free-foreground":
            status === "available" || status === undefined,
          "text-table-status-reserved-foreground": status === "reserved",
        },
        className
      )}
    />
  );
};

export default  RestaurantChair;