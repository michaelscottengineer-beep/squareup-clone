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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import NavigationList from "../components/NavigationList";
import ColorSetting from "../../../../../components/templates/settings/ColorSetting";
import TextSettingSection from "../../../../../components/templates/settings/TextSettingSection";
import SheetSettingHeader from "./SheetSettingHeader";
import ContactInformationList from "./ContactInformationList";
import { Tabs, TabsList } from "@/components/ui/tabs";

const SheetContactSectionSettingContent = () => {
  const navigation = useNavigate();

  const setElemetData = useEditorTemplateState((state) => state.set);
  const setSection = useEditorTemplateState((state) => state.setSection);
  const sectionElementData = useEditorTemplateState(
    (state) => state.partEditorData.sections
  );
  const contactSectionData = sectionElementData.contactSection;

  return (
    <div>
      <SheetSettingHeader title="Contact Section Settings" />

      <div className="px-4 py-4 space-y-4">
  

        <ColorSetting
          label="Choose background color"
          value={contactSectionData.general.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            const generalData = contactSectionData["general"];

            setSection("contactSection", {
              general: {
                ...generalData,
                style: {
                  ...generalData.style,
                  backgroundColor: val,
                },
              },
            });
          }}
        />
        <ContactInformationList />
        {Object.entries(contactSectionData).map(([key, value]) => {
          if (value.type === "text") {
            return (
              <TextSettingSection
                label={value.displayName}
                defaultSettings={{
                  fontSize: contactSectionData[key].style?.fontSize,
                  text: contactSectionData[key].text ?? "",
                  color: contactSectionData[key].style?.color,
                }}
                onChangeCallBack={(type, value) => {
                  let newData = { ...contactSectionData[key] };
                  if (type === "text") newData = { ...newData, text: value };
                  else if (type === "fontSize")
                    newData.style = { ...newData.style, fontSize: value };
                  else if (type === "color")
                    newData.style = { ...newData.style, color: value };
                  setElemetData({
                    sections: {
                      ...sectionElementData,
                      ["contactSection"]: {
                        ...contactSectionData,
                        [key]: { ...newData },
                      },
                    },
                  });
                }}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default SheetContactSectionSettingContent;
