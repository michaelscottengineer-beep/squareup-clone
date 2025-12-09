import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, ChevronUp, Mail } from "lucide-react";

const SmsCampaignCollapsible = ({
  title,
  description,
  children,
  isValid,
}: {
  title: string;
  isValid?: boolean;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Collapsible className="border border-border rounded-md  group/col ">
      <CollapsibleTrigger className="flex items-center justify-between cursor-pointer hover:bg-muted/40 w-full  group-data-[state=open]/col:border-b group-data-[state=open]/col:border-border p-4">
        <div className="grid grid-cols-[auto_1fr]  gap-x-2 gap-y-1 ">
          <div className="flex h-max items-center-safe col-span-2 gap-2">
            <div className="h-full flex items-center">
              <CheckCircle2
                className={cn(
                  "aspect-square fill-muted text-muted-foreground",
                  {
                    "fill-green-700 text-white": isValid,
                  }
                )}
              />
            </div>
            <h4 className="text-lg font-semibold text-start h-max">{title}</h4>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <div className="w-4"></div>
            <span className=" text-xs text-muted-foreground text-start">
              {description}
            </span>
          </div>
        </div>
        <ChevronDown
          size={16}
          className="group-data-[state=closed]/col:block hidden"
        />
        <ChevronUp
          size={16}
          className="group-data-[state=open]/col:block hidden"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4 transition-all duration-500 animate-accordionUp">
        <div className=" ">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SmsCampaignCollapsible;
