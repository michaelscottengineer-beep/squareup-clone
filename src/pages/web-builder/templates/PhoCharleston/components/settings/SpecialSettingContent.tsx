import SettingSection from "@/components/templates/settings";
import ColorSetting from "@/components/templates/settings/ColorSetting";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";

export const SpecialSettingContent = () => {
  const specialData = usePhoCharlestonEditor(
    (state) => state.sections["special"]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const specialElements = specialData.elements;

  console.log(Object.entries(specialElements)[0][0]);
  return (
    <div>
      <SheetSettingHeader title="Section Setting"></SheetSettingHeader>

      <div className="p-4 space-y-4">
        <SettingSection label="General Color">
          <GeneralColorTabs />
        </SettingSection>
        <SettingSection label="Text Configuration">
          <Tabs
            defaultValue={
              Object.entries(specialElements).find(
                ([key, val]) => val.type === "text"
              )?.[0]
            }
          >
            <TabsList>
              {Object.entries(specialElements).map(([key, value]) => {
                if (value.type !== "text") return null;
                return (
                  <TabsTrigger value={key} key={key}>
                    {value.displayName}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {Object.entries(specialElements).map(([key, value]) => {
              if (value.type !== "text") return null;
              return (
                <TabsContent value={key} key={key}>
                  <TextSettingSection
                    defaultSettings={{
                      fontSize: specialElements[key].style?.fontSize,
                      text: specialElements[key].text ?? "",
                      color: specialElements[key].style?.color,
                    }}
                    onChangeCallBack={(type, value) => {
                      let newData = { ...specialElements[key] };
                      if (type === "text")
                        newData = { ...newData, text: value };
                      else if (type === "fontSize")
                        newData.style = { ...newData.style, fontSize: value };
                      else if (type === "color")
                        newData.style = { ...newData.style, color: value };

                      setSection("special", {
                        [key]: {
                          ...specialElements[key],
                          ...newData,
                        },
                      });
                    }}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </SettingSection>
      </div>
    </div>
  );
};



const GeneralColorTabs = () => {
  const specialData = usePhoCharlestonEditor((state) => state.sections["special"]);
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const elementData = specialData.elements.general;
  if (!elementData) return <div>Does not exists element: general</div>;

  return (
    <Tabs defaultValue="Background">
      <TabsList>
        <TabsTrigger value="Background">Background</TabsTrigger>
        <TabsTrigger value="Text">Text</TabsTrigger>
      </TabsList>

      <TabsContent value="Background">
        <ColorSetting
          value={elementData.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            setSection("special", {
              general: {
                ...elementData,
                style: {
                  ...elementData.style,
                  backgroundColor: val,
                },
              },
            });
          }}
        />
      </TabsContent>
      <TabsContent value="Text">
        <ColorSetting
          value={elementData.style?.color ?? ""}
          onValueChange={(val) => {
            setSection("special", {
              general: {
                ...elementData,
                style: {
                  ...elementData.style,
                  color: val,
                },
              },
            });
          }}
        />
      </TabsContent>
    </Tabs>
  );
};