import SettingSection from "@/components/templates/settings";
import ColorSetting from "@/components/templates/settings/ColorSetting";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InformationSettingContent = () => {
  const informationData = usePhoCharlestonEditor(
    (state) => state.sections["informationSection"]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const informationElements = informationData.elements;

  return (
    <div>
      <SheetSettingHeader title="Information Section Setting" />

      <div className="p-4 space-y-4">
        {/* General Color Setting */}
        <SettingSection label="General Color">
          <GeneralColorTabs />
        </SettingSection>

        {/* Text Configuration */}
        <SettingSection label="Text Configuration">
          <Tabs
            orientation="vertical"
            defaultValue={
              Object.entries(informationElements).find(
                ([key, val]) => val.type === "text"
              )?.[0]
            }
          >
            <div className="overflow-x-auto">
              <TabsList>
                {Object.entries(informationElements).map(([key, value]) => {
                  if (value.type !== "text") return null;
                  return (
                    <TabsTrigger value={key} key={key}>
                      {value.displayName}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {Object.entries(informationElements).map(([key, value]) => {
              if (value.type !== "text") return null;
              return (
                <TabsContent value={key} key={key}>
                  <TextSettingSection
                    defaultSettings={{
                      fontSize: informationElements[key].style?.fontSize,
                      text: informationElements[key].text ?? "",
                      color: informationElements[key].style?.color,
                    }}
                    onChangeCallBack={(type, value) => {
                      let newData = { ...informationElements[key] };
                      if (type === "text")
                        newData = { ...newData, text: value };
                      else if (type === "fontSize")
                        newData.style = { ...newData.style, fontSize: value };
                      else if (type === "color")
                        newData.style = { ...newData.style, color: value };

                      setSection("informationSection", {
                        [key]: {
                          ...informationElements[key],
                          ...newData,
                        },
                      });
                    }}
                  />
                </TabsContent>
              );
            })}
          </Tabs>
        </SettingSection>

        {/* Social Links Configuration */}
        <SettingSection label="Social Links">
          <SocialLinksSetting />
        </SettingSection>
      </div>
    </div>
  );
};

// Component cho General Color Settings
const GeneralColorTabs = () => {
  const informationData = usePhoCharlestonEditor(
    (state) => state.sections["informationSection"]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const elementData = informationData.elements.general;

  if (!elementData) return <div>Does not exist element: general</div>;

  return (
    <Tabs defaultValue="Background">
      <TabsList>
        <TabsTrigger value="Background">Background</TabsTrigger>
        <TabsTrigger value="Text">Text</TabsTrigger>
      </TabsList>

      <TabsContent value="Background">
        <ColorSetting
          value={elementData.style?.backgroundColor ?? ""}
          onValueChange={(val) => {
            setSection("informationSection", {
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
            setSection("informationSection", {
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

// Component cho Social Links Settings
const SocialLinksSetting = () => {
  const informationData = usePhoCharlestonEditor(
    (state) => state.sections["informationSection"]
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
  const socialLinksData = informationData.elements.socialLinks;

  if (!socialLinksData || !socialLinksData.data?.items) {
    return <div>No social links data</div>;
  }

  const handleSocialLinkChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedItems = [...(socialLinksData.data?.items ?? [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setSection("informationSection", {
      socialLinks: {
        ...socialLinksData,
        data: {
          ...socialLinksData.data,
          items: updatedItems,
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      {socialLinksData.data.items.map((item: any, index: number) => (
        <div key={index} className="space-y-2 p-4 border rounded-md">
          <div>
            <Label>Icon Type</Label>
            <Input
              value={item.icon}
              onChange={(e) =>
                handleSocialLinkChange(index, "icon", e.target.value)
              }
              placeholder="facebook, instagram, yelp"
            />
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={item.url}
              onChange={(e) =>
                handleSocialLinkChange(index, "url", e.target.value)
              }
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Label</Label>
            <Input
              value={item.label}
              onChange={(e) =>
                handleSocialLinkChange(index, "label", e.target.value)
              }
              placeholder="Facebook, Instagram, etc."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InformationSettingContent;
