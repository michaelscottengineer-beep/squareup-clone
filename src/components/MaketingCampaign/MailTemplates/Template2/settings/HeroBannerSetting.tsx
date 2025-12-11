import ImageSetting from "@/components/templates/settings/ImageSetting";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";

const HeroBannerSetting = () => {
  const heroImage = useTemplate2Editor((s) => s.sections.main.elements.heroImage);
  const setSectionElement = useTemplate2Editor((s) => s.setSectionElement);
  const sectionKey = "main";

  return (
    <div className="p-4">
      <ImageSetting
        label="Hero Image"
        value={heroImage.data?.src ?? ""}
        onValueChange={(src) => {
          setSectionElement(sectionKey, "heroImage", {
            data: {
              ...heroImage.data,
              src,
            },
          });
        }}
      />
    </div>
  );
};

export default HeroBannerSetting;
