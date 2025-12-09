import React, { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { useNavigate } from "react-router";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TContactList } from "@/types/brevo";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { useQuery } from "@tanstack/react-query";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { get } from "firebase/database";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { List, Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface ListSelectorProps
  extends Omit<SelectProps, "value" | "onValueChange"> {
  id?: string;
  value?: TContactList[];
  onValueChange?: (value: TContactList[]) => void;
}

const ListSelector = ({
  value,
  onValueChange,
  ...props
}: ListSelectorProps) => {
  const navigate = useNavigate();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const [checkedList, setCheckedList] = useState<{
    [key: string]: TContactList;
  }>({});
  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allLists()),
    queryFn: async () => {
      const docs = await get(keys.allListsRef());

      return convertFirebaseArrayData<TContactList>(docs.val());
    },
  });

  useEffect(() => {
    if (value)
      setCheckedList(
        value.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {} as { [key: string]: TContactList })
      );
  }, [value]);

  const selectedValue = useMemo(() => {
    return Object.entries(checkedList).reduce((acc, [key, val]) => {
      acc.push(val.basicInfo.name);
      return acc;
    }, [] as string[]);
  }, [checkedList]);

  const handleCheckedChange = (check: CheckedState, d: TContactList) => {
    const newList = { ...checkedList };

    if (check === true) {
      newList[d.id] = d;
    } else if (check === false) {
      delete newList[d.id];
    }
    setCheckedList(newList);
  };

  const handleOpenChange = (o: boolean) => {
    if (o) return;

    onValueChange?.(
      Object.entries(checkedList).map(([key, val]) => {
        return val;
      })
    );
  };

  return (
    <Select {...props} onOpenChange={handleOpenChange}>
      <SelectTrigger className="w-full">
        {selectedValue.length ? (
          selectedValue.map((val, i) => {
            return <Badge key={val + i} className="bg-primary/10 text-primary px-2">{val}</Badge>;
          })
        ) : (
          <SelectValue placeholder={"Select list(s)"}></SelectValue>
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
          Lists
        </div>

        <Separator />

        <div className="flex flex-col gap-1 min-h-[200px] p-4">
          {data?.map((list) => {
            const chkId = `chk-${list.id}`;
            return (
              <div className="flex items-center gap-2" key={list.id}>
                <Checkbox
                  id={chkId}
                  className="border-primary"
                  checked={!!checkedList[list.id]?.id}
                  onCheckedChange={(c) => {
                    handleCheckedChange(c, list);
                  }}
                />
                <Label htmlFor={chkId}>{list.basicInfo.name}</Label>
              </div>
            );
          })}
        </div>
      </SelectContent>
    </Select>
  );
};

export default ListSelector;
