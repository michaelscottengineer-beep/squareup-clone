import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

const DashedHr = ({
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <hr className={cn("border-t-[1.2px] border-dashed my-2", className)} />
  );
};

export default DashedHr;
