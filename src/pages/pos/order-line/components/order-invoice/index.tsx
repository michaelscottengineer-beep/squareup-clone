import DashedHr from "@/components/ui/dashed-hr";
import { cn } from "@/lib/utils";
import React, { type PropsWithChildren } from "react";

export const Panel = ({ children }: PropsWithChildren) => {
  return <div className="bg-white rounded-xl p-4">{children}</div>;
};

export const SectionHeader = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div className={cn("mb-3 flex justify-between", className)}>{children}</div>
  );
};

export const SectionContent = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

export const SectionTitle = ({ children }: PropsWithChildren) => {
  return <div className="font-medium text-lg">{children}</div>;
};

export const SectionItemText = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn("text-gray-400", className)}>{children}</div>;
};

export const SectionItemRow = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div className={cn("flex justify-between items-centers", className)}>
      {children}
    </div>
  );
};
