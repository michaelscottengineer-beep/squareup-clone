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

type TFormValues = {
  items: { label: string; url: string }[];
};

export default function NavigationList() {
  const navigation = useNavigate();
  const form = useForm<TFormValues>({
    defaultValues: {
      items: [],
    },
  });

  const setElemetData = useEditorTemplateState((state) => state.set);
  const headerElementData = useEditorTemplateState(
    (state) => state.partEditorData.header
  );

  const navigationData = useMemo(() => {
    return headerElementData.navigation.data;
  }, [headerElementData.navigation.data]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  useEffect(() => {
    if (navigationData)
      form.reset({
        items: navigationData.items,
      });
  }, [navigationData]);

  const onSubmit = (data: TFormValues) => {
    setElemetData({
      header: {
        ...headerElementData,
        navigation: {
          ...headerElementData.navigation,
          data: {
            ...navigationData,
            items: data.items,
          },
        },
      },
    });
  };

  return (
    <SettingSection label={headerElementData.navigation.displayName}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col gap-2">
            {fields.map((item: { label: string; url: string }, i: number) => {
              return (
                <div
                  key={i + 1}
                  className="grid grid-cols-[1fr_1fr_auto] gap-2"
                >
                  <FormField
                    control={form.control}
                    name={`items.${i}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${i}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      const prevData = headerElementData.navigation.data;
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
            <Button type="button" onClick={() => append({
              url: '',
              label: ''
            })}>
              <Plus />
              Add
            </Button>
            <Button variant={'secondary'} className="bg-purple-200 text-purple-400 hover:bg-purple-300 hover:text-white">
              <Save />
              Save
            </Button>
          </ButtonGroup>
        </form>
      </Form>
    </SettingSection>
  );
}
