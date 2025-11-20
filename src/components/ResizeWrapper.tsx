import { cn } from "@/lib/utils";
import React, { useState, type CSSProperties } from "react";
import { Button } from "./ui/button";
import { Resizable, ResizableBox } from "react-resizable";

interface ResizeWrapperProps {
  isSelected?: boolean;
  children?: React.ReactNode;
  style: CSSProperties;
  className?: string;
  name: string;
  onResizeChange?: (w: number, h: number) => void;
}

const ResizeWrapper = ({
  isSelected,
  style,
  name,
  className,
  onResizeChange,
  children,
}: ResizeWrapperProps) => {
  return (
    <div
      style={{
        height: "max-content",
        width: "max-content",
        ...style,
      }}
      className={cn(
        "relative",
        {
          "border border-primary cursor-move!": isSelected,
        },
        className
      )}
    >
      <div
        className={cn(
          "absolute bg-primary text-xs px-1 bottom-full text-primary-foreground left-0",
          {
            hidden: !isSelected,
          }
        )}
      >
        {name}
      </div>

      <Button
        className="dotResize bg-white border-primary border p-0 w-2 h-2 cursor-ew-resize top-1/2 -translate-y-1/2 -left-1 absolute"
        style={{
          display: isSelected ? "block" : "none",
        }}
      ></Button>
      <Button
        className="dotResize bg-white border-primary border p-0 w-2 h-2 cursor-ew-resize top-1/2 -translate-y-1/2 -right-1 absolute"
        style={{
          display: isSelected ? "block" : "none",
        }}
      ></Button>
      <Button
        className="dotResize bg-white border-primary border p-0 w-2 h-2 cursor-ns-resize left-1/2 -translate-x-1/2 -top-1 absolute"
        style={{
          display: isSelected ? "block" : "none",
        }}
      ></Button>
      <Button
        className="dotResize bg-white border-primary border p-0 w-2 h-2 cursor-ns-resize left-1/2 -translate-x-1/2 -bottom-1 absolute"
        style={{
          display: isSelected ? "block" : "none",
        }}
      ></Button>

     

      {children}
    </div>
  );
};

export default ResizeWrapper;
