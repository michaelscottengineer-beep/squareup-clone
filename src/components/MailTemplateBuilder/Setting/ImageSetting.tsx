import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import UploadImageArea from "@/components/UploadImageArea";
import React, { useState } from "react";
import SettingWrapper from "./SettingWrapper";

interface ImageSettingProps {
  value: string;
  label?: string;
  onValueChange?: (url: string) => void;
}

const ImageSetting = ({ value, label, onValueChange }: ImageSettingProps) => {
  const [src, setSrc] = useState(value ?? "");

  const [open, setOpen] = useState(false);

  return (
    <SettingWrapper label={label}>
      <InputGroup>
        <InputGroupInput value={src} onChange={(e) => {
          setSrc(e.target.value);
          onValueChange?.(e.target.value);
        }} />
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
    </SettingWrapper>
  );
};

export default ImageSetting;
