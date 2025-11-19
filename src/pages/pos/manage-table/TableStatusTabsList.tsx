import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
const tabs = [
  {
    label: "All",
  },
  { label: "Reservation" },
  { label: "On Dine" },
  { label: "Available" },
];
const TableStatusTabsList = ({
  onValueChange,
}: {
  onValueChange?: (val: string ) => void;
}) => {
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);

  return (
    <div className="flex items-center gap-4">
      {tabs.map((tab) => {
        return (
          <Button
            key={tab.label}
            className={cn(
              "bg-white hover:bg-white border border-border h-max! w-max! px-8! text-gray-500",
              {
                "border-primary text-black": selectedTab.label === tab.label,
              }
            )}
            onClick={() => {
              onValueChange?.(tab.label)
              setSelectedTab(tab);
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default TableStatusTabsList;
