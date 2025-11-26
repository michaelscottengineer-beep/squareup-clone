import ImageSetting from "@/components/templates/settings/ImageSetting";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";

const HeroBannerSettingContent = () => {
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections["heroBanner"]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);

  const elements = sectionData.elements;

  return (
    <div>
      <SheetSettingHeader title="Banner Setting" ></SheetSettingHeader>
      <div className="p-4">
        <ImageSetting
          value={elements.banner.data?.src}
          onValueChange={(src) => {
            setSection("heroBanner", {
              banner: {
                ...elements.banner,
                data: {
                  ...elements.banner.data,
                  src
                }
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default HeroBannerSettingContent;
