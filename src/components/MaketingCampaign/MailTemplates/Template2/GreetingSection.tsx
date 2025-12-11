import SettingOverlay from "@/components/templates/SettingOverlay";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";
import GreetingSetting from "./settings/GreetingSetting";

const GreetingSection = () => {
  const main = useTemplate2Editor((s) => s.sections.main);
  const isEditing = useTemplate2Editor((s) => s.isEditing);

  const m = main.elements;

  return (
    <div style={{ padding: "24px" }} className="relative">
      <h2 style={m.greetingTitle?.style ?? undefined}>
        {m.greetingTitle?.text ?? ""}
      </h2>
      <p style={m.greetingParagraph?.style ?? undefined}>
        {m.greetingParagraph?.text ?? ""}
      </p>


       {isEditing && (
        <SettingOverlay
          settingContent={<GreetingSetting />}
          className="block!"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default GreetingSection;
