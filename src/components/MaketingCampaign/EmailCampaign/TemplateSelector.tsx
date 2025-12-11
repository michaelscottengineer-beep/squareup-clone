import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { useNavigate } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TContactList, TMailTemplate } from "@/types/brevo";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { useQuery } from "@tanstack/react-query";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { get } from "firebase/database";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { List, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TemplateSelectorProps
  extends Omit<SelectProps, "value" | "onValueChange"> {
  id?: string;
  value?: TMailTemplate;
  onValueChange?: (value?: TMailTemplate) => void;
}

const TemplateSelector = ({
  value,
  onValueChange,
  ...props
}: TemplateSelectorProps) => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const [checkedList, setCheckedList] = useState<TMailTemplate | undefined>(
    undefined
  );
  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allMailTemplates()),
    queryFn: async () => {
      const docs = await get(keys.allMailTemplatesRef());

      return convertFirebaseArrayData<TMailTemplate>(docs.val());
    },
  });

  useEffect(() => {
    setCheckedList(value);
  }, [value]);

  const handleCheckedChange = (check: CheckedState, d: TMailTemplate) => {
    setCheckedList(check ? d : undefined);
  };

  const handleOpenChange = (o: boolean) => {
    if (o) return;

    onValueChange?.(checkedList);
  };
console.log(data, 'tl')
  return (
    <Select {...props} onOpenChange={handleOpenChange}>
      <SelectTrigger className="w-full">
        {checkedList ? (
          <Badge className="bg-primary/10 text-primary px-2">
            {checkedList?.basicInfo?.name}
          </Badge>
        ) : (
          <SelectValue placeholder={"Select template"}></SelectValue>
        )}
      </SelectTrigger>

      <SelectContent className="p-0">
        <div className="p-4">
          <InputGroup>
            <InputGroupAddon align={"inline-start"}>
              <Search />
            </InputGroupAddon>
            <InputGroupInput value={"aasf"} />
          </InputGroup>
        </div>

        <Separator />

        <div className="flex items-center gap-2 p-4 text-primary">
          <List size={16} />
          Templates
        </div>

        <Separator />

        <div className="flex flex-col gap-1 min-h-[200px] p-4">
          {data?.map((template) => {
            const chkId = `chk-${template.id}`;
            return (
              <div className="flex items-center gap-2" key={template.id}>
                <Checkbox
                  id={chkId}
                  className="border-primary"
                  checked={checkedList?.id === template.id}
                  onCheckedChange={(c) => {
                    handleCheckedChange(c, template);
                  }}
                />
                <Label htmlFor={chkId}>{template.basicInfo.name}</Label>
              </div>
            );
          })}
        </div>
      </SelectContent>
    </Select>
  );
};

export default TemplateSelector;
