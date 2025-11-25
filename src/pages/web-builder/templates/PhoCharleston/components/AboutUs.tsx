import React from "react";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import SettingOverlay from "@/components/templates/SettingOverlay";
import AboutUsSettingContent from "../components/settings/AboutUsSettingContent";
import { cn } from "@/lib/utils";

interface AboutUsProps {
  aboutUsKey: string;
}

const AboutUs = ({ aboutUsKey }: AboutUsProps) => {
  const aboutUsData = usePhoCharlestonEditor(
    (state) => state.sections[aboutUsKey]
  );

  const layoutValue = aboutUsData.elements.layout.data?.value;

  return (
    <div className="relative ">
      <div
        className={cn("aboutUs flex p-20 gap-10 max-h-[520px] ", {
          "flex-row items-center": layoutValue === "LTR",
          "flex-row-reverse items-center ": layoutValue === "RTL",
          "flex-col": layoutValue === "TTB",
          "flex-col-reverse": layoutValue === "BTT",
        })}
      >
        <div className="left flex flex-col gap-4 basis-1/2 px-10">
          <div className="head">
            <div
              className="heading uppercase"
              style={{
                ...aboutUsData.elements.heading.style,
              }}
            >
              {aboutUsData.elements.heading.text}
            </div>
            <div
              className="subHeading uppercase"
              style={{
                ...aboutUsData.elements.subHeading.style,
              }}
            >
              {aboutUsData.elements.subHeading.text}
            </div>
          </div>

          <p
            style={{
              ...aboutUsData.elements.description.style,
            }}
          >
            {aboutUsData.elements.description.text}
          </p>

          <Button
            className="w-max px-10 uppercase py-2"
            style={{ ...aboutUsData.elements.redirectButton.style }}
          >
            {aboutUsData.elements.redirectButton.text}
          </Button>
        </div>

        <div className="right basis-1/2">
          <img
            src={aboutUsData.elements.image.data?.src}
            alt="about-right-2"
            className="rounded-md w-full object-cover  max-h-[400px]"
          />
        </div>
      </div>

      <SettingOverlay settingContent={<AboutUsSettingContent aboutUsKey={aboutUsKey} />} />
    </div>
  );
};

export default AboutUs;
