
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { Book } from "lucide-react";
import { useNavigate } from "react-router";



const EmptyModifier = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex justify-center flex-col items-center gap-1">
        <div className="text-muted border-2 rounded-full h-max w-max p-5 flex mb-2 justify-center items-center">
          <Book className="w-8 h-8" />
        </div>

        <h3 className="font-bold text-lg">Your item modifiers</h3>
        <CardDescription>
          Modifiers make custom orders simple. Create modifiers that can be
          applied to an item for faster checkout.
        </CardDescription>
        <CardFooter>
          <Button
            onClick={() => navigate("/dashboard/items/modifiers/new")}
            className="rounded-full py-3 h-max w-max"
          >
            Create a modifier
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default EmptyModifier;