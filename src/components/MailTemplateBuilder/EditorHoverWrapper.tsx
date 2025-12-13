import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import { cn } from "@/lib/utils";
import React, { useState, type PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";

const EditorHoverWrapper = ({
  children,
  layout,
  index,
  variant,
  className,
}: PropsWithChildren<{
  layout: any;
  className?: string;
  index: number;
  variant: "element" | "column" | "row";
}>) => {
  const { selectedElement, setSelectedElement } =
    useMailTemplateEditorContext();

  const isActiveRow = selectedElement?.layout?.id === layout?.id && layout?.id;

  return (
    <table
      className={cn(
        "border border-dashed [&:has-[.child-hover]:bg-red-500]   relative border-border  ",
        variant === "row" &&
          "child-hover hover:[&_.hover-buttons]:flex! hover:border-blue-500",
        variant === "column" &&
          "hover:[&:not(:has(.child-hover:hover))]:border-blue-500 [&:not(:has(.child-hover:hover))]:hover:[&>_.hover-buttons]:flex! first-",
        isActiveRow && "border-blue-500 border-2",
        className
      )}
      style={{ height: "100%" }}
      width={"100%"}
    >
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>

      <div
        style={{
          display: "none",
        }}
        className="absolute hidden hover-buttons -top-5 bg-purple-400 rounded-lg min-w-10 right-0 shadow-xl  px-2 gap-2  items-center"
      >
        <Button
          variant={"ghost-primary"}
          className=" h-max w-max p-1! "
          onClick={() => {
            console.log(layout, index);
            setSelectedElement({ layout, index });
          }}
        >
          <Edit className="w-4! h-4! text-white" />
        </Button>
        <Button
          variant={"ghost-primary"}
          className=" h-max w-max p-1! "
          onClick={() => setSelectedElement(null)}
        >
          <Trash className="w-4! h-4! text-white" />
        </Button>
      </div>
    </table>
  );
};

export default EditorHoverWrapper;
