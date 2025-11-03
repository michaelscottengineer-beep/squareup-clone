import { Button } from "@/components/ui/button";

import { ArrowLeft, Folder, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import type { TItem, TItemForm } from "@/types/item";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, onValue, push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import type { TModifier } from "@/types/modifier";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";

function ModifierSelectionDialog() {
  const [selectedModifiers, setSelectedModifiers] = useState<TModifier[]>([]);
  const restaurantId = useCurrentRestaurantId((state) => state.id);

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
    setSelectedModifiers(useItemCreationFormData.getState().modifiers);
  }, []);

  const handleSelectChange = (value: TModifier) => {
    console.log(value);
    if (!selectedModifiers.includes(value)) {
      setSelectedModifiers([...selectedModifiers, value]);
    } else {
      const referencedArray = [...selectedModifiers];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedModifiers(referencedArray);
    }
  };
  const isOptionSelected = (value: TModifier): boolean => {
    return selectedModifiers.includes(value) ? true : false;
  };

  console.log("modifiers123,", selectedModifiers);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="justify-start gap-3 h-auto hover:bg-muted"
        >
          <span className="text-base">
            {selectedModifiers.length > 0 ? "Edit" : "Add"}
          </span>
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
                  useItemCreationFormData
                    .getState()
                    .setModifiers(selectedModifiers)
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
                <div className="flex items-center gap-1">
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
