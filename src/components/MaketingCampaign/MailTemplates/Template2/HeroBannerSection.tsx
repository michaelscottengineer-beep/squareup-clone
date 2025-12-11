import SettingOverlay from "@/components/templates/SettingOverlay";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";
import HeroBannerSetting from "./settings/HeroBannerSetting";

const HeroBannerSection = () => {
  const main = useTemplate2Editor((s) => s.sections.main);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  // convenience refs to elements
  const m = main.elements;
  return (
    <div className="relative">
      <img
        src={m.heroImage?.data?.src ?? ""}
        alt={m.heroImage?.data?.alt ?? "hero"}
        style={m.heroImage?.style ?? undefined}
      />
      {isEditing && (
        <SettingOverlay
          settingContent={<HeroBannerSetting />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default HeroBannerSection;
