import { Label } from "@/components/ui/label";

import useEditorTemplateState from "@/stores/use-editor-template-state";

import { Checkbox } from "@/components/ui/checkbox";

import NavigationList from "../components/NavigationList";
import ColorSetting from "@/components/templates/settings/ColorSetting";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import SheetSettingHeader from "./SheetSettingHeader";



const SheetHeaderSettingContent = () => {

  const setElemetData = useEditorTemplateState((state) => state.set);
  const headerElementData = useEditorTemplateState(
    (state) => state.partEditorData.header
  );

  return (
    <div>
      <SheetSettingHeader title="Header Settings" />

      <div className="px-4 py-4 space-y-4">
        <NavigationList />

        <ColorSetting
          label="Choose Text color"
          value={headerElementData.general.style?.color ?? ""}
          onValueChange={(val) => {
            const generalData = headerElementData["general"];

            setElemetData({
              header: {
                ...headerElementData,
                general: {
                  ...generalData,
                  style: {
                    ...generalData.style,
                    color: val,
                  },
                },
              },
            });
          }}
        />

        <ColorSetting
          label="Choose background color"
          value={headerElementData.general.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            const generalData = headerElementData["general"];

            setElemetData({
              header: {
                ...headerElementData,
                general: {
                  ...generalData,
                  style: {
                    ...generalData.style,
                    backgroundColor: val,
                  },
                },
              },
            });
          }}
        />
        {Object.entries(headerElementData).map(([key, value]) => {
          if (value.type === "text") {
            return (
              <TextSettingSection
                label={value.displayName}
                defaultSettings={{
                  fontSize: headerElementData[key].style?.fontSize,
                  text: headerElementData[key].text ?? "",
                  color: headerElementData[key].style?.color,
                }}
                onChangeCallBack={(type, value) => {
                  let newPageNameData = { ...headerElementData?.pageName };
                  if (type === "text")
                    newPageNameData = { ...newPageNameData, text: value };
                  else if (
                    type === "fontSize" &&
                    newPageNameData?.style?.fontSize
                  )
                    newPageNameData.style.fontSize = value;
                  else if (type === "color" && newPageNameData?.style?.color)
                    newPageNameData.style.color = value;
                  setElemetData({
                    header: {
                      ...headerElementData,
                      [key]: newPageNameData ?? {},
                    },
                  });
                }}
              />
            );
          }
          if (value.type === "checkbox") {
            const element = headerElementData[key];
            return (
              <Label>
                <Checkbox
                  checked={!!element.data?.isChecked}
                  onCheckedChange={(e) => {
                    setElemetData({
                      header: {
                        ...headerElementData,
                        [key]: {
                          ...element,
                          data: {
                            ...element.data,
                            isChecked: e,
                          },
                        },
                      },
                    });
                  }}
                />
                {element.data?.label}
              </Label>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};


export default SheetHeaderSettingContent