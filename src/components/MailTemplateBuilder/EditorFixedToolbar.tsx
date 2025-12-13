import React, {
  useEffect,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import ElementSetting from "./ElementSetting";
import EditorHeader from "./EditorHeader";
import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import { ToolbarGroup } from "../ui/toolbar";
import { InsertToolbarButton } from "../ui/insert-toolbar-button";
import { TurnIntoToolbarButton } from "../ui/turn-into-toolbar-button";
import { FontSizeToolbarButton } from "../ui/font-size-toolbar-button";
import { FontColorToolbarButton } from "../ui/font-color-toolbar-button";
import { KEYS, type ElementOrTextIn, type Value } from "platejs";
import { BaselineIcon } from "lucide-react";
import { MarkToolbarButton } from "../ui/mark-toolbar-button";
import { Plate, usePlateEditor } from "platejs/react";
import { BaseEditorKit } from "../editor/editor-base-kit";
import { cn } from "@/lib/utils";
import { Editor, EditorContainer } from "../ui/editor";
import { FixedToolbar } from "../ui/fixed-toolbar";

const EditorFixedToolbar = () => {
  const { selectedElement, emailTemplate, setEmailTemplate } =
    useMailTemplateEditorContext();

  const elmStyle = selectedElement.layout.style;
  const [value, setValue] = useState<Value>([
    {
      type: "p",
      children: [
        {
          text: selectedElement?.layout?.props?.text || "",
          ...selectedElement.layout.style,
          underline: elmStyle.textDecoration === "underline",
          bold: elmStyle.fontWeight === "bold",
          italic: elmStyle.fontStyle === "italic",
        },
      ],
    },
  ]);
  const editor = usePlateEditor({
    plugins: BaseEditorKit,
    value,
  });

  useEffect(() => {
    const elmStyle = selectedElement.layout.style;
    const newNode: ElementOrTextIn<Value> = {
      type: "p",
      children: [
        {
          text: selectedElement?.layout?.props?.text || "",
          ...selectedElement.layout.style,
          underline: elmStyle.textDecoration === "underline",
          bold: elmStyle.fontWeight === "bold",
          italic: elmStyle.fontStyle === "italic",
        },
      ],
    };
    editor.tf.replaceNodes(newNode, {
      at: [0],
    });

    const textLength = selectedElement?.layout?.props?.text?.length || 0;

    editor.tf.select({
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: textLength },
    });
  }, [selectedElement, editor]);

  return (
    <Plate
      editor={editor}
      onValueChange={({ value }) => {
        const node = editor.children[0];
        const first = node.children[0];
        setValue(editor.children);
        const newStyle: any = {};
        const updatedEmailTemplate = { ...emailTemplate };
        const elm = updatedEmailTemplate.rows.byId[selectedElement.layout.id];

        const styles = Object.entries(first);
        for (const [key, val] of styles) {
          // updatedEmailTemplate.rows.byId[selectedElement.layout.id].style = {
          //   ...elm,
          // };
          switch (key) {
            case "bold":
              newStyle.fontWeight = val ? "bold" : "normal";
              break;
            case "italic":
              newStyle.fontStyle = val ? "italic" : "normal";
              break;
            case "underline":
              newStyle.textDecoration = val ? "underline" : "none";
              break;
            case "fontSize":
              newStyle.fontSize = val || undefined;
              break;
            case "color":
              newStyle.color = val || undefined;
              break;
          }
        }

        elm.style = {
          ...newStyle,
        };
        updatedEmailTemplate.rows.byId[selectedElement.layout.id] = {
          ...elm,
        };
        setEmailTemplate(updatedEmailTemplate);
      }}
    >
      <FixedToolbar
        className={cn(
          "sticky top-(--editor-header-height) justify-start rounded-t-lg "
        )}
        style={{
          textDecoration: "n",
        }}
      >
        <ToolbarGroup>
          <InsertToolbarButton />
          <TurnIntoToolbarButton />
          <FontSizeToolbarButton />
        </ToolbarGroup>

        <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
          <BaselineIcon />
        </FontColorToolbarButton>

        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
      </FixedToolbar>

      <EditorContainer className="hidden">
        <Editor />
      </EditorContainer>
    </Plate>
  );
};

export default EditorFixedToolbar;
