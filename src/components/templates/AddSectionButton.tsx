import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CardWithImageAndText from "./built-section/CardWithImageAndText";

interface AddSectionButtonProps {
  text?: string;
  order?: number;
}
const AddSectionButton = ({ text = "Add Section", order}: AddSectionButtonProps) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{text}</Button>
        </DialogTrigger>
        <DialogContent className="max-sm:bg-red-500">
        <div className="max-w-">
            <CardWithImageAndText order={order} />
        </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddSectionButton;
