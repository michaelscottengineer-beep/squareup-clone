import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Edit, X } from "lucide-react";

const ToggleEditButton = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);

  return (
    <Button
      className={cn("fixed bottom-5 right-5 rounded-full", {
        "bg-yellow-500": !isEditing,
        "bg-destructive": isEditing,
      })}
      onClick={() => {
        toggleEdit(!isEditing);
      }}
    >
      {isEditing ? <X /> : <Edit />}
    </Button>
  );
};

export default ToggleEditButton;
