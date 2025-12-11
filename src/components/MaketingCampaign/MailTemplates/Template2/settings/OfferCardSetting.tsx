import ButtonSetting from "@/components/templates/settings/ButtonSetting";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";

const OfferCardSetting = ({ sectionKey }: { sectionKey: string }) => {
  const section = useTemplate2Editor((s) => s.sections[sectionKey]);
  const setSectionElement = useTemplate2Editor((s) => s.setSectionElement);
  const sectionEls = section.elements;

  return (
    <div className="p-4 space-y-4">
      {Object.entries(sectionEls).map(([elKey, el]) => {
        if (el.type === "text") {
          return (
            <TextSettingSection
              label={el.displayName}
              defaultSettings={{
                fontSize: el.style?.fontSize,
                color: el.style?.color,
                text: el.text,
              }}
              onChangeCallBack={(type, value) => {
                const curData = { ...el };
                if (type === "text") curData.text = value;
                else curData.style = { ...curData.style, [type]: value };
                setSectionElement(sectionKey, elKey, {
                  ...curData,
                });
              }}
            />
          );
        } else if (el.type === "image") {
          return (
            <ImageSetting
              label={el.displayName}
              value={el.data?.src ?? ""}
              onValueChange={(src) => {
                setSectionElement(sectionKey, elKey, {
                  data: {
                    ...el.data,
                    src,
                  },
                });
              }}
            />
          );
        } else if (el.type === "button") {
          return (
            <ButtonSetting
              initData={{ url: el.data?.url, text: el.text?.toString() }}
              onChangeCallback={(data) => {
                setSectionElement(sectionKey, elKey, {
                  text: data.text,
                  data: {
                    ...el.data,
                    url: data.url,
                  },
                });
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default OfferCardSetting;
