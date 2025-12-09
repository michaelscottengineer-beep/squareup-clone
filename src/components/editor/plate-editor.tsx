import * as React from "react";

import { normalizeNodeId, type Value } from "platejs";
import { Plate, usePlateEditor, type TPlateEditor } from "platejs/react";
import { serializeHtml } from "platejs/static"; // Static import

import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { Button } from "../ui/button";
import { BaseEditorKit } from "./editor-base-kit";
import { FixedToolbar } from "../ui/fixed-toolbar";
import { MarkToolbarButton } from "../ui/mark-toolbar-button";
import { FontColorToolbarButton } from "../ui/font-color-toolbar-button";
import { KEYS } from "platejs";
import { BaselineIcon } from "lucide-react";
import { FontSizeToolbarButton } from "../ui/font-size-toolbar-button";
import { ToolbarGroup } from "../ui/toolbar";
import { InsertToolbarButton } from "../ui/insert-toolbar-button";
import { TurnIntoToolbarButton } from "../ui/turn-into-toolbar-button";

interface PlateEditorProps {
  initValue?: Value;
  onValueChangeCallback?: (value: Value, editor: any) => void;
}

export function PlateEditor({
  initValue,
  onValueChangeCallback,
}: PlateEditorProps) {
  const [value, setValue] = React.useState<Value>(initValue ?? []);
  const editor = usePlateEditor({
    plugins: BaseEditorKit,
    value: initValue,
  });

  React.useEffect(() => {
    setValue(initValue ?? []);
  }, [initValue]);

  return (
    <Plate
      editor={editor}
      onChange={async ({ value, editor }) => {
        onValueChangeCallback?.(value, editor);
        setValue(value);
      }}
    >
      <FixedToolbar className="justify-start rounded-t-lg">
        <ToolbarGroup>
          <InsertToolbarButton />
          <TurnIntoToolbarButton />
          <FontSizeToolbarButton />
        </ToolbarGroup>

        <FontSizeToolbarButton />
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
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>
      {/* <Button
        onClick={async () => {
          editor.children = value;
          const html = await serializeHtml(editor, {});
          console.log("sf", html);
        }}
      >
        Save
      </Button> */}
    </Plate>
  );
}
