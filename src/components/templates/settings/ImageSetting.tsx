import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import UploadImageArea from "@/pages/dashboard/item-invetory/items/UploadImageArea";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import SettingSection from ".";

interface ImageSettingProps {
  value: string;
  label?: string;
  onValueChange?: (url: string) => void;
}

const ImageSetting = ({ value, label, onValueChange }: ImageSettingProps) => {
  const [src, setSrc] = useState(value ?? "");

  const [open, setOpen] = useState(false);

  return (
    <SettingSection label={label}>
      <InputGroup>
        <InputGroupInput value={src} onChange={(e) => setSrc(e.target.value)} />
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton onClick={() => setOpen(true)} className="text-primary">
            Or Upload
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent>
          <UploadImageArea value={src} onValueChange={(val) => setSrc(val)} />

          <DialogClose>
            <Button onClick={() => onValueChange?.(src)}>Done</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </SettingSection>
  );
};

export default ImageSetting;
