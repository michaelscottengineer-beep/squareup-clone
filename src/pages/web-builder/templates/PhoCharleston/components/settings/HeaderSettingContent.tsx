import React from "react";
import SettingOverlay from "../../../../../../components/templates/SettingOverlay";
import SheetSettingHeader from "../../../../../../components/templates/SheetSettingHeader";
import SettingSection from "../../../../../../components/templates/settings";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorSetting from "../../../../../../components/templates/settings/ColorSetting";
import HeaderNavSetting from "./HeaderNavSetting";

const HeaderSettingContent = () => {

  return (
    <div>
      <SheetSettingHeader title="Header Settings"></SheetSettingHeader>

      <div className="px-4 py-4 space-y-4">
        <GeneralColorTabs />

        <HeaderNavSetting />
      </div>
    </div>
  );
};

const GeneralColorTabs = () => {
  const headerData = usePhoCharlestonEditor((state) => state.header);
  const setData = usePhoCharlestonEditor((state) => state.set);
  const elementData = headerData.elements.general;
  if (!elementData) return <div>Does not exists element: general</div>;

  return (
    <Tabs defaultValue="Background">
      <TabsList >
        <TabsTrigger value="Background">Background</TabsTrigger>
        <TabsTrigger value="Text">Text</TabsTrigger>
      </TabsList>

      <TabsContent value="Background">
        <ColorSetting
          value={elementData.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            setData("header", {
              general: {
                ...elementData,
                style: {
                  ...elementData.style,
                  backgroundColor: val,
                },
              },
            });
          }}
        />
      </TabsContent>
      <TabsContent value="Text">
          <ColorSetting
          value={elementData.style?.color ?? ""}
          onValueChange={(val) => {
            setData("header", {
              general: {
                ...elementData,
                style: {
                  ...elementData.style,
                  color: val,
                },
              },
            });
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
export default HeaderSettingContent;
