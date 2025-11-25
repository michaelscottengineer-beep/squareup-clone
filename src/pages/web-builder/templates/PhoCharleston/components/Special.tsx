import SettingOverlay from "@/components/templates/SettingOverlay";
import { Button } from "@/components/ui/button";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";
import { useNavigate } from "react-router";
import { SpecialSettingContent } from "./settings/SpecialSettingContent";

const Special = () => {
  const navigate = useNavigate();
  const specialData = usePhoCharlestonEditor(
    (state) => state.sections["special"]
  );
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);

  return (
    <div className="relative">
      <div
        className="flex flex-col justify-center items-center gap-4 min-h-[calc(100svh/2)]"
        style={{
          ...specialData.elements.general.style,
        }}
      >
        <h1
          className="font-extrabold uppercase"
          style={{
            ...specialData.elements.title.style,
          }}
        >
          {specialData.elements.title.text}
        </h1>
        <p
          className="font-bold"
          style={{
            ...specialData.elements.description.style,
          }}
        >
          {specialData.elements.description.text}
        </p>
        <div
          className="hours font-bold"
          style={{
            ...specialData.elements.hours.style,
          }}
        >
          {specialData.elements.hours.text}
        </div>

        <Button
          onClick={() => navigate("")}
          className="bg-[#474947] border-2 text-lg uppercase border-[#BCBCBC] text-[#D7D9D6] hover:text-white hover:border-[#A5DD99] hover:bg-[#474947] w-max px-10 py-2 h-max"
        >
          {specialData.elements.redirectButton.text}
        </Button>
      </div>
      {isEditing && (
        <SettingOverlay settingContent={<SpecialSettingContent />} />
      )}
    </div>
  );
};

export default Special;
