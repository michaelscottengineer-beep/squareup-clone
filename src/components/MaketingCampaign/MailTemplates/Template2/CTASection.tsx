import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";
import CTASetting from "./settings/CTASetting";
import SettingOverlay from "@/components/templates/SettingOverlay";

const CTASection = () => {
  const main = useTemplate2Editor((s) => s.sections.ctaSection);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  const m = main.elements;

  return (
    <div className="relative">
      <div style={m.ctaPanel?.style ?? undefined}>
        <h3 style={m.ctaHeadline?.style ?? undefined}>
          {m.ctaHeadline?.text ?? ""}
        </h3>
        <p style={m.ctaParagraph?.style ?? undefined}>
          {m.ctaParagraph?.text ?? ""}
        </p>

        <a
          href={m.ctaButton?.data?.url ?? "#"}
          style={{
            textDecoration: "none",
            display: "inline-block",
            ...((m.ctaButton?.style as React.CSSProperties) ?? {}),
          }}
        >
          {m.ctaButton?.text ?? ""}
        </a>
      </div>

      {isEditing && (
        <SettingOverlay
          settingContent={<CTASetting />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default CTASection;
