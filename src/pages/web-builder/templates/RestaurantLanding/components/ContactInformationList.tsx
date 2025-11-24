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
import SettingSection from "../../../../../components/templates/settings";
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
import IconSetting from "../../../../../components/templates/settings/IconSetting";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import ColorSetting from "../../../../../components/templates/settings/ColorSetting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TFormValues = {
  items: { title: string; description: string; iconName: string }[];
};

export default function ContactInformationList() {
  const form = useForm<TFormValues>({
    defaultValues: {
      items: [],
    },
  });

  const setSection = useEditorTemplateState((state) => state.setSection);
  const contactSectionData = useEditorTemplateState(
    (state) => state.partEditorData.sections.contactSection
  );

  const contactInformationData = useMemo(() => {
    return contactSectionData.contactBlock.data;
  }, [contactSectionData.contactBlock.data]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  useEffect(() => {
    if (contactInformationData)
      form.reset({
        items: contactInformationData.items,
      });
  }, [contactInformationData]);

  const onSubmit = (data: TFormValues) => {
    setSection("contactSection", {
      contactBlock: {
        ...contactSectionData.contactBlock,
        data: {
          ...contactInformationData,
          items: data.items,
        },
      },
    });
  };

  return (
    <SettingSection label={contactSectionData.contactBlock.displayName}>
      <div className="mb-4">
        <Label>Color Settings</Label>
        <Tabs defaultValue="Background">
          <TabsList>
            <TabsTrigger value="Background">Background</TabsTrigger>
            <TabsTrigger value="Icon">Icon</TabsTrigger>
            <TabsTrigger value="Text">Text</TabsTrigger>
            <TabsTrigger value="Border">Border</TabsTrigger>
          </TabsList>

          <TabsContent value="Background">
            <ColorSetting
              value={
                contactSectionData.contactBlock.style?.backgroundColor ?? ""
              }
              onValueChange={(val) => {
                setSection("contactSection", {
                  contactBlock: {
                    ...contactSectionData.contactBlock,
                    style: {
                      ...contactSectionData.contactBlock.style,
                      backgroundColor: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
          <TabsContent value="Icon">
            <ColorSetting
              value={contactSectionData.contactBlock.style?.iconColor ?? ""}
              onValueChange={(val) => {
                setSection("contactSection", {
                  contactBlock: {
                    ...contactSectionData.contactBlock,
                    style: {
                      ...contactSectionData.contactBlock.style,
                      iconColor: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
          <TabsContent value="Text">
            <ColorSetting
              value={contactSectionData.contactBlock.style?.color ?? ""}
              onValueChange={(val) => {
                setSection("contactSection", {
                  contactBlock: {
                    ...contactSectionData.contactBlock,
                    style: {
                      ...contactSectionData.contactBlock.style,
                      color: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
          <TabsContent value="Border">
            <ColorSetting
              value={contactSectionData.contactBlock.style?.borderColor ?? ""}
              onValueChange={(val) => {
                setSection("contactSection", {
                  contactBlock: {
                    ...contactSectionData.contactBlock,
                    style: {
                      ...contactSectionData.contactBlock.style,
                      borderColor: val,
                    },
                  },
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Label>Edit Items</Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {fields.map((item, i) => {
              return (
                <div key={i + 1} className="grid grid-cols-2 gap-2 mb-4">
                  <Label>Block {i + 1}</Label>
                  <FormField
                    control={form.control}
                    name={`items.${i}.title`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input {...field} className="col" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${i}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${i}.iconName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputGroup className="fle">
                            <InputGroupAddon align={"inline-start"}>
                              <Icon icon={field.value} />
                              <IconSetting
                                value={field.value}
                                onValueChange={(iconName) =>
                                  field.onChange(iconName)
                                }
                              />
                            </InputGroupAddon>
                            <InputGroupInput {...field} disabled />
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      const prevData = contactSectionData.navigation.data;
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
                  title: "",
                  description: "",
                  iconName: "",
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
