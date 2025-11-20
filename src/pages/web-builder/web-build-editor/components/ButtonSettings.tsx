import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ButtonSettingsProps {
  defaultValue: {
    text: string;
  };
}
const ButtonSettings = ({ defaultValue }: ButtonSettingsProps) => {
  const [text, setText] = useState("");


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>ButtonSettings</Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex items-center justify-between border-b border-border">
          <div>Button Settings</div>
          <PopoverClose>
            <X />
          </PopoverClose>
        </div>

        <div>
          <Label>Text</Label>
          <Input />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonSettings;
