import { useState, type CSSProperties } from "react";
import SettingSection from ".";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ColorSetting from "./ColorSetting";

interface TextSettingSection {
  defaultSettings?: {
    fontSize: CSSProperties["fontSize"];
    text?: string | number;
    color?: CSSProperties["color"];
  };
  onChangeCallBack?: (
    type: "text" | "fontSize" | "color",
    value: any
  ) => void;
  label: string;
}
const TextSettingSection = ({
  label,
  defaultSettings,
  onChangeCallBack,
}: TextSettingSection) => {
  const [settings, setSettings] = useState(
    defaultSettings ?? {
      fontSize: "16px",
      text: "",
    }
  );

  return (
    <SettingSection label={label}>
      <div className="space-y-2">
        <Label>Font Size</Label>
        <Input
          placeholder="Font Size"
          value={settings.fontSize}
          onChange={(e) => {
            setSettings((prev) => ({ ...prev, fontSize: e.target.value }));
            onChangeCallBack?.("fontSize", e.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Text</Label>
        <Input
          placeholder="Edit Text"
          value={settings.text}
          onChange={(e) => {
            setSettings((prev) => ({ ...prev, text: e.target.value }));
            onChangeCallBack?.("text", e.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Text color</Label>

        <ColorSetting
          value={settings?.color}
          onValueChange={(val) => {
            setSettings((prev) => ({ ...prev, color: val }));
            onChangeCallBack?.("color", val);
          }}
        />
      </div>
    </SettingSection>
  );
};

export default TextSettingSection;
