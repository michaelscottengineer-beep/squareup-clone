import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";

import { Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import SettingSection from "../../components/settings";

type TFormValues = {
  items: {
    label: string;
    href: string;
  }[];
};

const HeaderNavSetting = () => {
  const nav = usePhoCharlestonEditor((state) => state.header.elements.nav);
  const setData = usePhoCharlestonEditor((state) => state.set);
  const form = useForm<TFormValues>({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (nav.data?.items)
      form.reset({
        items: nav.data.items,
      });
  }, [nav.data?.items]);

  const onSubmit = (data: TFormValues) => {
    setData("header", {
      nav: {
        ...nav,
        data: {
          ...nav.data,
          items: data.items,
        },
      },
    });
  };

  return (
    <SettingSection label={nav.displayName}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-col gap-3  max-h-[200px] overflow-y-auto">
            {fields.map((item, i) => {
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
                        <FormLabel>Text</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${i}.href`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url</FormLabel>
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
                  href: "",
                  label: "",
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
};

export default HeaderNavSetting;
