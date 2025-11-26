import SettingOverlay from "@/components/templates/SettingOverlay";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";
import HeroBannerSettingContent from "./settings/HeroBannerSettingContent";

const HeroBanner = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections["heroBanner"]
  );
  const heroBannerElements = sectionData.elements;

  return (
    <div className="hero-banner relative">
      <div>
        <img
          src={heroBannerElements.banner.data?.src}
          className="w-full h-[calc(100vh-147px)] object-cover"
        />
      </div>
      {isEditing && (
        <SettingOverlay settingContent={<HeroBannerSettingContent />} />
      )}
    </div>
  );
};

export default HeroBanner;
