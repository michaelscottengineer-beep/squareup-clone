import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { get, ref,  } from "firebase/database";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";

import type { TModifier } from "@/types/modifier";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";

function ModifierSelectionDialog() {
  // const [selectedItems, setSelectedItems] = useState<TModifier[]>([]);
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const selectedItems = useItemCreationFormData((state) => state.modifiers);
  const setSelectedItems = useItemCreationFormData(
    (state) => state.setModifiers
  );
  const { data: modifiers } = useQuery({
    queryKey: ["modifiers"],
    queryFn: async () => {
      const itemsRef = ref(
        db,
        parseSegments("restaurants", restaurantId, "allModifiers")
      );
      const doc = await get(itemsRef);
      console.log("docval", doc.val());
      return doc.val() ? convertFirebaseArrayData<TModifier>(doc.val()) : [];
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    setSelectedItems(useItemCreationFormData.getState().modifiers);
  }, []);

  const handleSelectChange = (value: TModifier) => {
    console.log(value);
    if (!selectedItems.includes(value)) {
      setSelectedItems([...selectedItems, value]);
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
    }
  };
  const isOptionSelected = (value: TModifier): boolean => {
    return selectedItems.includes(value) ? true : false;
  };

  console.log("modifiers123,", selectedItems);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={selectedItems.length > 0 ? "link" : "secondary"}
          className="justify-start gap-3 h-auto "
        >
          {selectedItems.length > 0 ? "Edit" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent className=" " showCloseButton={false}>
        <div>
          <DialogHeader className="flex flex-row items-center justify-between h-max">
            <DialogClose className="" type="button">
              <Button variant={"secondary"} className="rounded-full">
                <ArrowLeft />
              </Button>
            </DialogClose>
            <DialogClose type="button">
              <Button
                className="rounded-full px-5 py-3 w-max"
                onClick={() =>
                  useItemCreationFormData.getState().setModifiers(selectedItems)
                }
              >
                Done
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-1 my-8">
            <h1 className="text-xl font-semibold ">Add modifiers</h1>
            <p className="text-gray-500 text-sm">
              Select modifier sets to apply to this item. Create new or manage
              existing modifier sets in Items{" "}
              <Link to={"#"} className="text-[#333] underline font-semibold">
                Modifiers
              </Link>
              .
            </p>
          </div>
          <div className="w-full">
            {modifiers?.map((m, index) => (
              <Label
                key={m.id}
                className="grid grid-cols-[1fr_auto] cursor-pointer gap-4 items-center hover:bg-muted p-2 rounded-md"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-lg">
                    {m.basicInfo.displayName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {m.list.map((item) => item.name).join(",")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm">locate</div>
                  <Checkbox
                    checked={isOptionSelected(m)}
                    onCheckedChange={(e) => {
                      handleSelectChange(m);
                    }}
                  />
                </div>
              </Label>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModifierSelectionDialog;
