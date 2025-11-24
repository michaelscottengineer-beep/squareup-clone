import "@/styles/phoCharlestonTemplate.css";

import { Separator } from "@/components/ui/separator";
import React from "react";
import PhoCharlestonHeader from "./components/Header";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import SettingOverlay from "../../../../components/templates/SettingOverlay";
import AboutUsSettingContent from "./components/settings/AboutUsSettingContent";
import { cn } from "@/lib/utils";

const PhoCharleston = () => {
  const aboutUsData = usePhoCharlestonEditor((state) => state.aboutUs);

  const layoutValue = aboutUsData.elements.layout.data?.value;

  return (
    <div>
      <PhoCharlestonHeader />

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
            <div className="head">
              <div
                className="heading"
                style={{
                  ...aboutUsData.elements.heading.style,
                }}
              >
                {aboutUsData.elements.heading.text}
              </div>
              <div
                className="subHeading"
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
              className="w-max "
              style={{ ...aboutUsData.elements.redirectButton.style }}
            >
              {aboutUsData.elements.redirectButton.text}
            </Button>
          </div>

          <div className="right basis-1/2">
            <img
              src={aboutUsData.elements.image.data?.src}
              alt="about-right-2"
              className="rounded-md "
            />
          </div>
        </div>

        <SettingOverlay settingContent={<AboutUsSettingContent />} />
      </div>
    </div>
  );
};

export default PhoCharleston;
