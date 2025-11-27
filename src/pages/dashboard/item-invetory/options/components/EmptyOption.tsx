import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Book } from "lucide-react";
import { useNavigate } from "react-router";


const EmptyOption = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex justify-center flex-col items-center gap-1">
        <div className="text-muted border-2 rounded-full h-max w-max p-5 flex mb-2 justify-center items-center">
          <Book className="w-8 h-8" />
        </div>

        <h3 className="font-bold text-lg">Options</h3>
        <CardDescription>
          Add options to an item to create variations. For example, adding Size
          options to an item can create variations Small and Medium. Group these
          options together by creating an option set called Shirt Sizes.
        </CardDescription>
        <CardFooter>
          <Button
            onClick={() => navigate("/dashboard/items/options/new")}
            className="rounded-full py-3 h-max w-max"
          >
            Add options
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default EmptyOption;
