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

interface EditOverlayProps {
  partEditorKey: string;
}
const EditOverlay = ({ partEditorKey }: EditOverlayProps) => {
  return (
    <div className="bg-black/30 w-full h-full absolute top-0 left-0 backdrop-blur-[1px]">
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
      <SheetContent showCloseButton={false}>
        {partEditorKey === "header" && <SheetHeaderSettingContent />}
      </SheetContent>
    </Sheet>
  );
};

interface SheetSettingHeader {
  title: string;
}
const SheetSettingHeader = ({ title }: SheetSettingHeader) => {
  return (
    <div className="flex justify-between items-center border-b border-border px-4 py-2">
      <SheetTitle>{title}</SheetTitle>
      <SheetClose asChild>
        <Button variant={"ghost"} className="rounded-full">
          <X />
        </Button>
      </SheetClose>
    </div>
  );
};

const SheetHeaderSettingContent = () => {
  const navigation = useNavigate();

  const setElemetData = useEditorTemplateState((state) => state.set);
  const headerElementData = useEditorTemplateState(
    (state) => state.partEditorData.header
  );

  return (
    <div>
      <SheetSettingHeader title="Header Settings" />

      <div className="px-4 py-4 space-y-4">
        <NavigationList />

        <ColorSetting
          label="Choose Text color"
          value={headerElementData.general.style?.color ?? ""}
          onValueChange={(val) => {
            const generalData = headerElementData["general"];

            setElemetData({
              header: {
                ...headerElementData,
                general: {
                  ...generalData,
                  style: {
                    ...generalData.style,
                    color: val,
                  },
                },
              },
            });
          }}
        />

        <ColorSetting
          label="Choose background color"
          value={headerElementData.general.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            const generalData = headerElementData["general"];

            setElemetData({
              header: {
                ...headerElementData,
                general: {
                  ...generalData,
                  style: {
                    ...generalData.style,
                    backgroundColor: val,
                  },
                },
              },
            });
          }}
        />
        {Object.entries(headerElementData).map(([key, value]) => {
          if (value.type === "text") {
            return (
              <TextSettingSection
                label={value.displayName}
                defaultSettings={{
                  fontSize: headerElementData[key].style?.fontSize,
                  text: headerElementData[key].text ?? "",
                  color: headerElementData[key].style?.color,
                }}
                onChangeCallBack={(type, value) => {
                  let newPageNameData = { ...headerElementData?.pageName };
                  if (type === "text")
                    newPageNameData = { ...newPageNameData, text: value };
                  else if (
                    type === "fontSize" &&
                    newPageNameData?.style?.fontSize
                  )
                    newPageNameData.style.fontSize = value;
                  else if (type === "color" && newPageNameData?.style?.color)
                    newPageNameData.style.color = value;
                  setElemetData({
                    header: {
                      ...headerElementData,
                      [key]: newPageNameData ?? {},
                    },
                  });
                }}
              />
            );
          }
          if (value.type === "checkbox") {
            const element = headerElementData[key];
            return (
              <Label>
                <Checkbox
                  checked={!!element.data?.isChecked}
                  onCheckedChange={(e) => {
                    setElemetData({
                      header: {
                        ...headerElementData,
                        [key]: {
                          ...element,
                          data: {
                            ...element.data,
                            isChecked: e,
                          },
                        },
                      },
                    });
                  }}
                />
                {element.data?.label}
              </Label>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default EditOverlay;
