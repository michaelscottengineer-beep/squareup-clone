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
import ColorSetting from "../../components/settings/ColorSetting";
import TextSettingSection from "../../components/settings/TextSettingSection";
import SheetSettingHeader from "./SheetSettingHeader";
import ContactInformationList from "./ContactInformationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticInformationList from "./StatisticInformationList";

const StatisticSectionSetting = () => {
  const navigation = useNavigate();

  const setElemetData = useEditorTemplateState((state) => state.set);
  const setSection = useEditorTemplateState((state) => state.setSection);
  const sectionElementData = useEditorTemplateState(
    (state) => state.partEditorData.sections
  );
  const statisticSectionData = sectionElementData.statisticSection;
  console.log(sectionElementData);

  return (
    <div>
      <SheetSettingHeader title="Statistic Section Settings" />

      <div className="px-4 py-4 space-y-4">
        <Tabs defaultValue="Background">
          <TabsList>
            <TabsTrigger value="Background">Background</TabsTrigger>
            <TabsTrigger value="StatCount">Stat Count</TabsTrigger>
            <TabsTrigger value="Text">Text</TabsTrigger>
          </TabsList>
          <TabsContent value="Background">
            <ColorSetting
              value={statisticSectionData.general.style?.backgroundColor ?? ""}
              onValueChange={(val) => {
                const generalData = statisticSectionData["general"];

                setSection("statisticSection", {
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
          </TabsContent>
          <TabsContent value="StatCount">
            <ColorSetting
              value={statisticSectionData.stat.style?.statisticCountColor ?? ""}
              onValueChange={(val) => {
                const statData = statisticSectionData["stat"];

                setSection("statisticSection", {
                  stat: {
                    ...statData,
                    style: {
                      ...statData.style,
                      statisticCountColor: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
          <TabsContent value="Text">
            <ColorSetting
              value={statisticSectionData.stat.style?.color ?? ""}
              onValueChange={(val) => {
                const statData = statisticSectionData["stat"];

                setSection("statisticSection", {
                  stat: {
                    ...statData,
                    style: {
                      ...statData.style,
                      color: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
        </Tabs>
        <StatisticInformationList />
        {Object.entries(statisticSectionData).map(([key, value]) => {
          if (value.type === "text") {
            return (
              <TextSettingSection
                label={value.displayName}
                defaultSettings={{
                  fontSize: statisticSectionData[key].style?.fontSize,
                  text: statisticSectionData[key].text ?? "",
                  color: statisticSectionData[key].style?.color,
                }}
                onChangeCallBack={(type, value) => {
                  let newData = { ...statisticSectionData[key] };
                  if (type === "text") newData = { ...newData, text: value };
                  else if (type === "fontSize")
                    newData.style = { ...newData.style, fontSize: value };
                  else if (type === "color")
                    newData.style = { ...newData.style, color: value };
                  setElemetData({
                    sections: {
                      ...sectionElementData,
                      ["contactSection"]: {
                        ...statisticSectionData,
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

export default StatisticSectionSetting;
