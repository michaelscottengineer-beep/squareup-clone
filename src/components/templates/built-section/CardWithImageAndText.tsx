import React from "react";
import SettingOverlay from "../SettingOverlay";
import { cn } from "@/lib/utils";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import AboutUsSettingContent from "@/pages/web-builder/templates/PhoCharleston/components/settings/AboutUsSettingContent";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import TextSettingSection from "@/components/templates/settings/TextSettingSection";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlexLayoutSetting from "@/components/templates/settings/FlexLayoutSetting";

interface CardWithImageAndTextProps {
  sectionKey?: string;
  order?: number;
}

const COMPONENT_NAME = "CardWithImageAndText";

const CardWithImageAndText = ({
  sectionKey,
  order,
}: CardWithImageAndTextProps) => {
  const sectionId = 123;
  // fetch json by sectionId
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections[sectionKey ?? ""]
  ) || {
    componentName: COMPONENT_NAME,
    elements: {
      title: {
        displayName: "Heading",
        type: "text",
        text: "About Us",
        style: {
          fontSize: "2.6v%",
          color: "#333333",
          fontWeight: "bold",
        },
      },
      subTitle: {
        displayName: "Sub Heading",
        type: "text",
        text: "Hạ Long Café",
        style: {
          fontSize: "20px",
          color: "#5D6E58",
        },
      },
      description: {
        displayName: "Description",
        type: "text",
        text: "Authenticate Vietnamese food and bubble tea owned by a Vietnamese family in downtown Charleston.",
        style: {
          fontSize: "18px",
          color: "#333333",
        },
      },
      redirectButton: {
        displayName: "Redirect Button",
        type: "button",
        text: "OUR MENU",
        style: {
          fontSize: "18px",
          color: "#D7D9D6",
          backgroundColor: "#474947",
          padding: "20px 20px",
        },
        data: {
          redirectUrl: "/123",
        },
      },
      image: {
        displayName: "Image",
        type: "image",
        style: {},
        data: {
          src: "/about_right_2.jpg",
        },
      },
      layout: {
        displayName: "Change Layout",
        type: "layout",
        data: {
          value: "LTR",
        },
      },
    },
  };
  const layoutValue = sectionData.elements.layout.data?.value;

  return (
    <div className="relative">
      <div
        className={cn("aboutUs flex p-20 gap-10  mt-4", {
          "flex-row items-center": layoutValue === "LTR",
          "flex-row-reverse items-center ": layoutValue === "RTL",
          "flex-col": layoutValue === "TTB",
          "flex-col-reverse": layoutValue === "BTT",
        })}
      >
        <div className="left flex flex-col gap-4 basis-1/2">
          <div className="">
            <div
              className="title max-sm:text-sm"
              style={{
                ...sectionData.elements.title.style,
              }}
            >
              {sectionData.elements.title.text}
            </div>
            <div
              className="sub__title"
              style={{
                ...sectionData.elements.subTitle.style,
              }}
            >
              {sectionData.elements.subTitle.text}
            </div>
          </div>

          <p
            style={{
              ...sectionData.elements.description.style,
            }}
          >
            {sectionData.elements.description.text}
          </p>

          <Button
            className="w-max "
            style={{ ...sectionData.elements.redirectButton.style }}
          >
            {sectionData.elements.redirectButton.text}
          </Button>
        </div>

        <div className="right basis-1/2">
          <img
            src={sectionData.elements.image.data?.src}
            alt="about-right-2"
            className="rounded-md "
          />
        </div>
      </div>

      {sectionKey && (
        <SettingOverlay
          settingContent={
            <CardWithImageAndTextSettingContent sectionKey={sectionKey ?? ""} />
          }
        />
      )}
    </div>
  );
};

const CardWithImageAndTextSettingContent = ({
  sectionKey,
}: {
  sectionKey: string;
}) => {
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections[sectionKey]
  );
  const setData = usePhoCharlestonEditor((state) => state.set);
  const sectionElements = sectionData.elements;

  return (
    <div>
      <SheetSettingHeader title="Section Settings"></SheetSettingHeader>

      <div className="px-4 mt-4 flex flex-col gap-4">
        <Tabs defaultValue={Object.entries(sectionElements)[0][0]}>
          <TabsList>
            {Object.entries(sectionElements).map(([key, value]) => {
              if (value.type !== "text") return null;
              return (
                <TabsTrigger value={key} key={key}>
                  {value.displayName}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(sectionElements).map(([key, value]) => {
            if (value.type !== "text") return null;
            return (
              <TabsContent value={key} key={key}>
                <TextSettingSection
                  defaultSettings={{
                    fontSize: sectionElements[key].style?.fontSize,
                    text: sectionElements[key].text ?? "",
                    color: sectionElements[key].style?.color,
                  }}
                  onChangeCallBack={(type, value) => {
                    let newData = { ...sectionElements[key] };
                    if (type === "text") newData = { ...newData, text: value };
                    else if (type === "fontSize")
                      newData.style = { ...newData.style, fontSize: value };
                    else if (type === "color")
                      newData.style = { ...newData.style, color: value };

                    setData(sectionKey, {
                      [key]: {
                        ...sectionElements[key],
                        ...newData,
                      },
                    });
                  }}
                />
              </TabsContent>
            );
          })}
        </Tabs>
        {Object.entries(sectionElements).map(([key, value]) => {
          if (value.type === "image") {
            return (
              <ImageSetting
                label="Image"
                value={value.data?.src}
                onValueChange={(url) => {
                  setData(sectionKey, {
                    [key]: {
                      ...sectionElements[key],
                      data: {
                        ...sectionElements[key].data,
                        src: url,
                      },
                    },
                  });
                }}
              />
            );
          }
          if (value.type === "layout") {
            return (
              <FlexLayoutSetting
                label={"Change layout"}
                value={value.data?.value}
                onValueChange={(value) => {
                  setData(sectionKey, {
                    [key]: {
                      ...sectionElements[key],
                      data: {
                        ...sectionElements[key].data,
                        value,
                      },
                    },
                  });
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default CardWithImageAndText;
