import { Button } from "@/components/ui/button";
import React, { useState, type PropsWithChildren } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Slot } from "@radix-ui/react-slot";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface IconSettingProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const IconSettingTrigger = ({
  children,
  asChild,
}: PropsWithChildren<{
  asChild?: boolean;
}>) => {
  return <DialogTrigger asChild={asChild}>{children}</DialogTrigger>;
};

type TIconfySearchResponse = {
  icons: string[];
};

const IconSetting = ({ value, onValueChange }: IconSettingProps) => {
  const [iconName, setIconName] = useState(value ?? "mynaui:question-solid");
  const [iconData, setIconData] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `https://api.iconify.design/search?query=${iconName}&pretty=1&limit=${20}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = (await res.json()) as TIconfySearchResponse;
      return data;
    },
    onSuccess: (data) => {
      setIconData(data.icons);
      toast.success("Search successfully");
    },
    onError: (err) => {
      console.error("search icon ", err);
    },
  });

  const handleSearchIcon = () => {
    mutation.mutate();
  };

  return (
    <Dialog onOpenChange={(o) => {
      if (!o) {
        setIconData([]);
        setIconName('')
      }
    }}>
      <DialogTrigger className="cursor-pointer">
        <span className="underline text-blue-500">Icon</span>
      </DialogTrigger>
      <DialogContent>
        <InputGroup>
          <InputGroupAddon align={"inline-start"}>
            <Icon icon={iconName ?? "mynaui:question-solid"} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={"Search icon: mynaui:question-solid"}
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
          />
          <InputGroupAddon align={"inline-end"}>
            <InputGroupButton onClick={handleSearchIcon}>
              <Search />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <div className="max-h-[200px] overflow-y-auto">
          {iconData.map((iconName) => {
            return (
              <div className="flex items-center gap-2">
                <Icon icon={iconName} /> <span>{iconName}</span>
                <Button
                  variant={"link"}
                  className="text-blue-500 hover:text-blue-500"
                  onClick={() => {
                    setIconName(iconName);
                    onValueChange?.(iconName);
                  }}
                >
                  Choose
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconSetting;
