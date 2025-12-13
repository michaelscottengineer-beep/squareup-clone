import React, { type CSSProperties, type PropsWithChildren } from "react";
import ElementSetting from "./ElementSetting";
import EditorHeader from "./EditorHeader";
import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import EditorFixedToolbar from "./EditorFixedToolbar";

const EditorLayout = ({ children }: PropsWithChildren) => {
  const { selectedElement, setEmailTemplate } = useMailTemplateEditorContext();



  const currentSelectedType = selectedElement?.layout?.type;

  return (
    <div
      className="gap-10 relative h-screen"
      style={
        {
          "--editor-header-height": "80px",
        } as CSSProperties
      }
    >
      <div className="sticky top-0 z-10 bg-background! h-(--editor-header-height)!">
        <EditorHeader />
      </div>
      <div className="flex relative gap-2 h-[calc(100vh-var(--editor-header-height))]">
        <div className="flex-1 relative">
          {currentSelectedType === "Text" && <EditorFixedToolbar />}
          <main
            className="flex justify-center  p-10"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 0.8)' stroke-dasharray='5 3' transform='scale(1 -1)' viewBox='0 0 32 32'%3E%3Cpath d='M0 .5h31.5V32'/%3E%3C/svg%3E")`,
            }}
          >
            {children}
          </main>
        </div>

        <div className="">
          <ElementSetting />
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
