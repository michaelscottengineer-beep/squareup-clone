import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

const RatingSelector = ({
  value,
  onValueChange,
}: {
  value?: number;
  onValueChange?: (rate: number) => void;
}) => {
  const [rate, setRate] = useState(value ?? 5);

  return (
    <div className="star flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        return (
          <Star
            key={i + 1}
            className={cn("fill-yellow-300 stroke-yellow-300 cursor-pointer", {
              "fill-none": i + 1 > rate,
            })}
            onClick={() => {
              setRate(i + 1);
              onValueChange?.(i + 1);
            }}
          />
        );
      })}
    </div>
  );
};

export default RatingSelector