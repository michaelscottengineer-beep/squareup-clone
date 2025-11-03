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
// import { modifierColumns } from "./modifier-columns";
import type { TModifier } from "@/types/modifier";
import type { TOption } from "@/types/option";
import { optionColumns } from "./option-columns";

const OptionsPage = () => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: options, isLoading } = useQuery({
    queryKey: ["options"],
    queryFn: async () => {
      const segments = parseSegments("restaurants", restaurantId, "allOptions");
      const optionsRef = ref(db, segments);

      const ret = await get(optionsRef);
      return convertFirebaseArrayData<TOption>(ret.val());
    },
  });
  if (isLoading) return <div className="font-bold text-xl">Loading options...</div>
  console.log(options);


  return (
    <div>
      <div className="flex items-center mb-10 justify-between">
        <h1 className="font-bold text-xl">Options</h1>
        <Button
          onClick={() => navigate("/dashboard/items/options/new")}
          className="rounded-full py-3 h-max w-max"
        >
          Add options
        </Button>
      </div>
      {options?.length ? (
        <DataTable columns={optionColumns} data={options} />
      ) : (
        <OptionEmptyData />
      )}
    </div>
  );
};

const OptionEmptyData = () => {
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
export default OptionsPage;
