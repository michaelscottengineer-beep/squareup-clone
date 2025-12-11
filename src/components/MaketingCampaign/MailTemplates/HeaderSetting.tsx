import React from "react";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";

const HeaderSetting = () => {
  const header = useTemplate1Editor((state) => state.header);
  const setData = useTemplate1Editor((state) => state.set);
  const els = header.elements;

  return (
    <div>
      <SheetSettingHeader title="Section Settings"></SheetSettingHeader>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {Object.entries(els).map(([key, value]) => {
          if (value.type === "image") {
            return (
              <ImageSetting
                label="Image"
                value={value.data?.src}
                onValueChange={(url) => {
                  const elementData = els.logo;

                  setData("header", {
                    logo: {
                      ...elementData,
                      data: {
                        ...elementData.data,
                        src: url,
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

export default HeaderSetting;
