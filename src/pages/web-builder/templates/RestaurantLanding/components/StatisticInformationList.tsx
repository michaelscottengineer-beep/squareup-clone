import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import SettingSection from "../../components/settings";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import IconSetting from "../../components/settings/IconSetting";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import ColorSetting from "../../components/settings/ColorSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TFormValues = {
  items: { label: string; count: string }[];
};

export default function StatisticInformationList() {
  const form = useForm<TFormValues>({
    defaultValues: {
      items: [],
    },
  });

  const setSection = useEditorTemplateState((state) => state.setSection);
  const statisticSectionData = useEditorTemplateState(
    (state) => state.partEditorData.sections.statisticSection
  );

  const statisticInformationData = useMemo(() => {
    return statisticSectionData.stat.data;
  }, [statisticSectionData.stat.data]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  useEffect(() => {
    if (statisticInformationData)
      form.reset({
        items: statisticInformationData.items,
      });
  }, [statisticInformationData]);

  const onSubmit = (data: TFormValues) => {
    setSection("statisticSection", {
      stat: {
        ...statisticSectionData.stat,
        data: {
          ...statisticInformationData,
          items: data.items,
        },
      },
    });
  };

  return (
    <SettingSection label={statisticSectionData.stat.displayName}>
      <Label>Edit Items</Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {fields.map((item, i) => {
              return (
                <div key={i + 1} className="grid grid-cols-2 gap-2 mb-4">
                  <Label>Stat {i + 1}</Label>
                  <FormField
                    control={form.control}
                    name={`items.${i}.label`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input {...field} className="col" placeholder="Label" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${i}.count`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input {...field} placeholder="Count" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      remove(i);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}
          </div>
          <ButtonGroup>
            <Button
              type="button"
              onClick={() =>
                append({
                  label: "",
                  count: "",
                })
              }
            >
              <Plus />
              Add
            </Button>
            <Button
              variant={"secondary"}
              className="bg-purple-200 text-purple-400 hover:bg-purple-300 hover:text-white"
            >
              <Save />
              Save
            </Button>
          </ButtonGroup>
        </form>
      </Form>
    </SettingSection>
  );
}
