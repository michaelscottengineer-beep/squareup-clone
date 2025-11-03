import React from "react";
import ModifierSelectionDialog from "./ModifierSelectionDialog";
import useItemCreationFormData from "@/stores/use-item-creation-form-data";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { TModifier } from "@/types/modifier";

const ModifierSection = () => {
  const modifiers = useItemCreationFormData((state) => state.modifiers);

  const handleRemove = (item: TModifier) => {
    useItemCreationFormData
      .getState()
      .setModifiers(modifiers.filter((m) => m.id !== item.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Modifiers</h2>
          <p className="text-sm text-gray-600">
            Allow customizations such as add-ons or special requests.{" "}
            <a href="#" className="text-blue-600 underline">
              Learn more
            </a>
          </p>
        </div>

        <ModifierSelectionDialog />
      </div>

      <div className="mt-5">
        {modifiers.map((m) => {
          return (
            <div key={m.id} className="flex items-center justify-between">
              <div className="gap-1 flex flex-col">
                <div className="font-semibold">{m.basicInfo.displayName}</div>
                <div className="text-gray-500">
                  {m.list.map((item) => item.name).join(",")}
                </div>
              </div>

              <Button
                onClick={() => handleRemove(m)}
                variant={"ghost"}
                size={"icon"}
                className="rounded-full"
              >
                <Trash2 />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModifierSection;
