import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { Edit, Trash2, X } from "lucide-react";
import React, {
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import TextSettingSection from "../components/settings/TextSettingSection";
import { Checkbox } from "@/components/ui/checkbox";
import ColorSetting from "../components/settings/ColorSetting";
import SettingSection from "../components/settings";
import { useNavigate } from "react-router";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import NavigationList from "./components/NavigationList";
import SheetHeaderSettingContent from "./components/HeaderSetting";
import SheetContactSectionSettingContent from "./components/ContactSectionSheeting";
import StatisticSectionSetting from "./components/StatisticSectionSetting";

interface EditOverlayProps {
  partEditorKey: string;
}
const EditOverlay = ({ partEditorKey }: EditOverlayProps) => {
  return (
    <div className="bg-black/30 w-full h-full absolute top-0 left-0 backdrop-blur-[1px] edit-overlay">
      <SettingSheet partEditorKey={partEditorKey} />
    </div>
  );
};

interface SettingSheetProps {
  partEditorKey: string;
}
const SettingSheet = ({ partEditorKey }: SettingSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Button className="bg-white text-black hover:bg-white hover:text-black">
          <Edit /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="overflow-y-auto">
        {partEditorKey === "header" && <SheetHeaderSettingContent />}
        {partEditorKey === "contactSection" && <SheetContactSectionSettingContent />}
        {partEditorKey === "statisticSection" && <StatisticSectionSetting />}
      </SheetContent>
    </Sheet>
  );
};


export default EditOverlay;
