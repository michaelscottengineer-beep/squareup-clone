import React from "react";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlexLayoutSetting from "@/components/templates/settings/FlexLayoutSetting";

interface AboutUsSettingContentProps {
  aboutUsKey: string;
}
const AboutUsSettingContent = ({ aboutUsKey }: AboutUsSettingContentProps) => {
  const aboutUsData = usePhoCharlestonEditor(
    (state) => state.sections[aboutUsKey]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const aboutUsElements = aboutUsData.elements;

  return (
    <div>
      <SheetSettingHeader title="Section Settings"></SheetSettingHeader>

      <div className="px-4 mt-4 flex flex-col gap-4">
        <Tabs defaultValue={Object.entries(aboutUsElements)[0][0]}>
          <TabsList>
            {Object.entries(aboutUsElements).map(([key, value]) => {
              if (value.type !== "text") return null;
              return (
                <TabsTrigger value={key} key={key}>
                  {value.displayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(aboutUsElements).map(([key, value]) => {
            if (value.type !== "text") return null;
            return (
              <TabsContent value={key} key={key}>
                <TextSettingSection
                  defaultSettings={{
                    fontSize: aboutUsElements[key].style?.fontSize,
                    text: aboutUsElements[key].text ?? "",
                    color: aboutUsElements[key].style?.color,
                  }}
                  onChangeCallBack={(type, value) => {
                    let newData = { ...aboutUsElements[key] };
                    if (type === "text") newData = { ...newData, text: value };
                    else if (type === "fontSize")
                      newData.style = { ...newData.style, fontSize: value };
                    else if (type === "color")
                      newData.style = { ...newData.style, color: value };

                    setSection(aboutUsKey, {
                      [key]: {
                        ...aboutUsElements[key],
                        ...newData,
                      },
                    });
                  }}
                />
              </TabsContent>
            );
          })}
        </Tabs>
        {Object.entries(aboutUsElements).map(([key, value]) => {
          if (value.type === "image") {
            return (
              <ImageSetting
                label="Image"
                value={value.data?.src}
                onValueChange={(url) => {
                  setSection(aboutUsKey, {
                    [key]: {
                      ...aboutUsElements[key],
                      data: {
                        ...aboutUsElements[key].data,
                        src: url,
                      },
                    },
                  });
                }}
              />
            );
          }
          if (value.type === "layout") {
            return (
              <FlexLayoutSetting
                label={"Change layout"}
                value={value.data?.value}
                onValueChange={(value) => {
                  setSection(aboutUsKey, {
                    [key]: {
                      ...aboutUsElements[key],
                      data: {
                        ...aboutUsElements[key].data,
                        value,
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

export default AboutUsSettingContent;
