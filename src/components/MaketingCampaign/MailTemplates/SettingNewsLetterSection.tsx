import React from "react";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlexLayoutSetting from "@/components/templates/settings/FlexLayoutSetting";
import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";
import SettingSection from "@/components/templates/settings";
import ButtonSetting from "@/components/templates/settings/ButtonSetting";

const SettingNewsLetterSection = () => {
  const body = useTemplate1Editor((state) => state.sections.body);
  const setSection = useTemplate1Editor((state) => state.setSection);
  const els = body.elements;

  return (
    <div>
      <SheetSettingHeader title="Section Settings"></SheetSettingHeader>

      <div className="px-4 mt-4 flex flex-col gap-4">
        <Tabs defaultValue={Object.entries(els)[0][0]}>
          <TabsList>
            {Object.entries(els).map(([key, value]) => {
              if (value.type !== "text") return null;
              return (
                <TabsTrigger value={key} key={key}>
                  {value.displayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(els).map(([key, value]) => {
            if (value.type !== "text") return null;
            return (
              <TabsContent value={key} key={key}>
                <TextSettingSection
                  defaultSettings={{
                    fontSize: els[key].style?.fontSize,
                    text: els[key].text ?? "",
                    color: els[key].style?.color,
                  }}
                  onChangeCallBack={(type, value) => {
                    let newData = { ...els[key] };
                    if (type === "text") newData = { ...newData, text: value };
                    else if (type === "fontSize")
                      newData.style = { ...newData.style, fontSize: value };
                    else if (type === "color")
                      newData.style = { ...newData.style, color: value };

                    setSection("body", {
                      [key]: {
                        ...els[key],
                        ...newData,
                      },
                    });
                  }}
                />
              </TabsContent>
            );
          })}
        </Tabs>

        {Object.entries(els).map(([key, value]) => {
          if (value.type === "image") {
            return (
              <ImageSetting
                label="Image"
                value={value.data?.src}
                onValueChange={(url) => {
                  setSection("body", {
                    [key]: {
                      ...els[key],
                      data: {
                        ...els[key].data,
                        src: url,
                      },
                    },
                  });
                }}
              />
            );
          }

          if (value.type === "button") {
            return (
              <ButtonSetting
                label="News letter Button"
                initData={{ url: value.data?.url ?? "" }}
              />
            );
          }

          if (value.type === "layout") {
            return (
              <FlexLayoutSetting
                label={"Change layout"}
                value={value.data?.value}
                onValueChange={(value) => {
                  setSection("body", {
                    [key]: {
                      ...els[key],
                      data: {
                        ...els[key].data,
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

export default SettingNewsLetterSection;
