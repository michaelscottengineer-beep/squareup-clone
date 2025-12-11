import SettingOverlay from "@/components/templates/SettingOverlay";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";
import HeaderSetting from "./settings/HeaderSetting";

const HeaderSection = () => {
  const header = useTemplate2Editor((s) => s.sections.header);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  const h = header.elements;

  return (
    <div
      style={h.logoBlock?.style ?? undefined}
      className="header-block relative"
    >
      {/* HEADER (logo block) */}
      <img
        src={h.logoImage?.data?.src ?? ""}
        alt={h.logoImage?.data?.alt ?? "logo"}
        style={h.logoImage?.style ?? undefined}
      />
            
       {isEditing && (
        <SettingOverlay
          settingContent={<HeaderSetting />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default HeaderSection;
