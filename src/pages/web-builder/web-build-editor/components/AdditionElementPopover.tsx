import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useEditorState from "@/stores/use-editor-state";
import type { id } from "date-fns/locale";
import { useState } from "react";

const elements = [
  {
    name: "Text",
    variants: [
      {
        name: "Themed Text",
        examples: [
          {
            name: "Example 1",
            json: {
              type: "text",
              text: "This is a text",
              variant: "text",
              id: "themed-text-system-1",
              position: { x: 500, y: 300 },
              style: {
              },
            },
          },
        ],
      },
      { name: "Paragraphs", examples: [{ name: "Example 1" }] },
      {
        name: "Collapsible Text",
        examples: [
          { name: "Example 1" },
          {
            json: {
              type: "collapsible-text",
              id: "collapsible-text-system-1",
              properties: {
                title: "Collapsible Text Example",
                content:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
              },
            },
          },
        ],
      },
    ],
  },
  {
    name: "Button",
    variants: [
      {
        name: "Themed Button",
        examples: [
          {
            name: "Example Button 1",
            json: {
              type: "button",
              text: "Button",
              variant: "text",
              id: "themed-button-system-1",
              position: { x: 300, y: 500 },
              style: {
                backgroundColor: "#414141",
                width: "140px",
                height: "40px",
                color: "#fff",
                cursor: "pointer",
              },
            },
          },
        ],
      },
    ],
  },
];
export default function AdditionElementPopover({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [selectedElement, setSelectedElement] = useState<
    (typeof elements)[number]
  >(elements[0]);
  const [selectedVariant, setSelectedVariant] = useState<
    (typeof elements)[number]["variants"][number]
  >(elements[0].variants[0]);
  const addHtml = useEditorState((state) => state.add);

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        className="w-[800px] p-0 mt-4 grid grid-cols-4"
      >
        <div className=" py-4 flex flex-col items-start bg-muted rounded-none  gap-2  px-4">
          {elements.map((element) => {
            return (
              <Button
                variant={
                  selectedElement.name === element.name ? "default" : "ghost"
                }
                key={element.name}
                onClick={() => setSelectedElement(element)}
                className={cn(
                  "rounded-full hover:bg-primary/10 hover:text-primary",
                  {
                    "bg-primary/10 text-primary":
                      selectedElement.name === element.name,
                  }
                )}
              >
                {element.name}
              </Button>
            );
          })}
        </div>

        <div className="bg-white p-4 gap-2 flex flex-col items-start border-r border-border">
          {selectedElement.variants.map((variant) => (
            <Button
              variant={
                selectedVariant.name === variant.name ? "default" : "ghost"
              }
              key={variant.name}
              className={cn(
                "rounded-full hover:bg-primary/10 hover:text-primary",
                {
                  "bg-primary/10 text-primary":
                    selectedVariant.name === variant.name,
                }
              )}
              onClick={() => setSelectedVariant(variant)}
            >
              {variant.name}
            </Button>
          ))}
        </div>

        <div className="bg-white p-4">
          {selectedVariant.examples.map((example) => (
            <Button
              variant={
                selectedElement.name === example.name ? "default" : "ghost"
              }
              key={example.name}
              className={cn(
                "rounded-full hover:bg-primary/10 hover:text-primary",
                {
                  "bg-primary/10 text-primary": "",
                }
              )}
              onClick={() => {
                console.log(example.json, 'json ẽamople');  
                if (example.json) addHtml({...example.json, id: example.json.id + `${Math.random() * 999999}`} as any);
              }}
            >
              {example.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const PopoverElementVariants = ({
  isShow,
}: {
  isShow?: boolean;
  name: string;
}) => {
  // return (
  // );
};
