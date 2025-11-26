import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Edit, X } from "lucide-react";

interface ToggleEditButtonProps {
  iconOnly?: boolean;
}

const ToggleEditButton = ({ iconOnly }: ToggleEditButtonProps) => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const toggleEdit = usePhoCharlestonEditor((state) => state.toggleEdit);

  return (
    <Button
      className={cn("", {
        "bg-yellow-500 hover:bg-yellow-400": !isEditing,
        "bg-destructive hover:bg-destructive/80": isEditing,
      })}
      onClick={() => {
        toggleEdit(!isEditing);
      }}
    >
      {isEditing ? <X /> : <Edit />}
      {!iconOnly && isEditing && "Close Editing"}
      {!iconOnly && !isEditing && "Edit"}
    </Button>
  );
};

export default ToggleEditButton;
