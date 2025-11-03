import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import { Book } from "lucide-react";
import { useNavigate } from "react-router";
import { modifierColumns } from "./modifier-columns";
import type { TModifier } from "@/types/modifier";

const ModifierHomePage = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: modifiers, isLoading } = useQuery({
    queryKey: ["modifiers"],
    queryFn: async () => {
      const segments = parseSegments(
        "restaurants",
        restaurantId,
        "allModifiers"
      );
      const modifiersRef = ref(db, segments);

      const ret = await get(modifiersRef);
      return convertFirebaseArrayData<TModifier>(ret.val());
    },
  });
  if (isLoading)
    return <div className="font-bold text-xl">Loading modifiers...</div>;
  console.log(modifiers);

  return (
    <div>
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-xl">Modifiers</h1>
        <Button
          onClick={() => navigate("/dashboard/items/modifiers/new")}
          className="rounded-full py-3 h-max w-max"
        >
          Add modifier
        </Button>
      </div>

      {modifiers?.length ? (
        <DataTable columns={modifierColumns} data={modifiers} />
      ) : (
        <ModifierEmptyData />
      )}
    </div>
  );
};

const ModifierEmptyData = () => {
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
export default ModifierHomePage;
