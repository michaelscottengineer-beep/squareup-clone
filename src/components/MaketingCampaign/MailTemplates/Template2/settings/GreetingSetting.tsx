import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import useTemplate2Editor from "@/stores/template-editor/useTemplate2Editor";
import React from "react";
import { useShallow } from "zustand/react/shallow";

const GreetingSetting = () => {
  const mainEls = useTemplate2Editor(
    useShallow((state) => {
      const mainEls = state.sections.main.elements;

      return [mainEls.greetingTitle, mainEls.greetingParagraph]
    })
  );
  const sectionKey = "main";
  const setSectionElement = useTemplate2Editor((s) => s.setSectionElement);

  return (
    <div className="p-4">
      {mainEls.map((el) => {
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
                if (el.key) setSectionElement(sectionKey, el.key, {
                  ...curData,
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

export default GreetingSetting;
