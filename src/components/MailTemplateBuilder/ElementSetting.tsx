import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import React from "react";
import ContentSetting from "./Setting/ContentSetting";
import TextSetting from "./Setting/TextSetting";
import ImageSetting from "./Setting/ImageSetting";

const ElementSetting = () => {
  const { selectedElement } = useMailTemplateEditorContext();

  const { layout, index } = selectedElement ?? {};
  const children = layout?.children;
  const element = layout?.type !== "column" ? layout : null;

  return (
    <div className="bg-white p-4 w-md sticky top-(--editor-header-height) ">
      <h1 className="font-bold text-xl">Settings</h1>

      {element && (
        <div className="space-y-2">
          <div>
            {element.type === "Image" && (
              <ImageSetting
                label="Image Source"
                value={element?.props?.src}
                onValueChange={(src) => {}}
              />
            )}
          </div>
          {element?.props?.text && <TextSetting />}
        </div>
      )}
    </div>
  );
};

export default ElementSetting;
