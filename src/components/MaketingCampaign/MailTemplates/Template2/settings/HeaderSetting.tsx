import ImageSetting from "@/components/templates/settings/ImageSetting";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";

const HeaderSetting = () => {
  const header = useTemplate2Editor((s) => s.sections.header);
  const setSectionElement = useTemplate2Editor((s) => s.setSectionElement);
  const sectionKey = "header";

  const h = header.elements;

  const logoImage = h.logoImage;
  return (
    <div className="p-4">
      <ImageSetting
        label="Brand Logo"
        value={logoImage.data?.src ?? ""}
        onValueChange={(src) => {
          setSectionElement(sectionKey, "logoImage", {
            data: {
              ...logoImage.data,
              src,
            },
          });
        }}
      />
    </div>
  );
};

export default HeaderSetting;
