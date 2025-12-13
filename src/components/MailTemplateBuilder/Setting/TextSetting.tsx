import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import React from "react";
import ContentSetting from "../Setting/ContentSetting";
import ColorSetting from "./ColorSetting";

const TextSetting = () => {
  const { selectedElement, setEmailTemplate, emailTemplate } =
    useMailTemplateEditorContext();

  const { layout, index } = selectedElement ?? {};
  const children = layout?.children;
  const element = layout?.type !== "column" ? layout : null;
  console.log(element, layout, index);
  const handleUpdate = (data: any) => {
    const updateEmailTemplate = [...emailTemplate].map((l: any) => {
      if (l.id === layout.id) {
        return {
          ...l,
          children: {
            ...l?.children,
            [index]: {
              ...element,
              ...data,
            },
          },
        };
      }
      return l;
    });
    setEmailTemplate(updateEmailTemplate);
  };
  
  return (
    <div>
      <h2>Text Settings</h2>

      <div className="space-y-2">
        <ContentSetting
          label="Content"
          value={element.props.text}
          onValueChange={(text) => {
            handleUpdate({ props: { ...element.props, text } });
          }}
        />

        <ColorSetting
          label="Color"
          value={element.style.color}
          onValueChange={(color) => {
            handleUpdate({ style: { ...element.style, color } });
          }}
        />
      </div>
    </div>
  );
};

export default TextSetting;
