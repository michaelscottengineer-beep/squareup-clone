import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Folder } from "lucide-react";
import CreateCategoryDialog from "./CreateCategoryDialog";

const EmptyCategory = () => {
  return (
    <Card className="px-4 rounded-xl w-full">
      <CardContent className="text-center flex flex-col items-center space-y-4">
        <Folder className="w-20 h-20 text-gray-400" />
        <CardTitle>Item Categories</CardTitle>
        <CardDescription className="max-w-[500px]">
          Categories help organize your items, determine how customers navigate
          your Square Online site, report on item sales and route items to
          specific printers.
        </CardDescription>
        <CreateCategoryDialog />
      </CardContent>
    </Card>
  );
};

export default EmptyCategory;
