import React, { useEffect, useState } from "react";
import SettingSection from ".";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type TData = {
  url: string;
};
interface ButtonSettingProps {
  label?: string;
  initData: TData;
  onChangeCallback?: (data: TData) => void;
}
const ButtonSetting = ({
  label,
  initData,
  onChangeCallback,
}: ButtonSettingProps) => {
  const [data, setData] = useState(initData);

  useEffect(() => {
    setData(initData);
  }, [initData]);

  useEffect(() => {
    onChangeCallback?.(data);
  }, [data]);

  return (
    <SettingSection label={label}>
      <div>
        <Label>URL</Label>
        <Input
          value={data.url}
          onChange={(e) =>
            setData((prev) => ({ ...prev, url: e.target.value }))
          }
        />
      </div>
    </SettingSection>
  );
};

export default ButtonSetting;
