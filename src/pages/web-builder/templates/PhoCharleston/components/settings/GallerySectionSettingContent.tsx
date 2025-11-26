import SettingSection from "@/components/templates/settings";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type TFormValues = {
  items: {
    image: string;
  }[];
};
const GallerySectionSettingContent = () => {
  const gallery = usePhoCharlestonEditor(
    (state) => state.sections["gallerySection"].elements.gallery
  );
  const setSection = usePhoCharlestonEditor((state) => state.setSection);
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
    if (gallery.data?.items)
      form.reset({
        items: gallery.data.items,
      });
  }, [gallery.data?.items]);

  const onSubmit = (data: TFormValues) => {
    setSection("gallerySection", {
      gallery: {
        ...gallery,
        data: {
          ...gallery.data,
          items: data.items,
        },
      },
    });
  };

  return (
    <div>
      <SheetSettingHeader title="Gallery Settings" />
      <div className="p-4">
        <SettingSection label={gallery.displayName}>
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
                        name={`items.${i}.image`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image Src {i + 1}</FormLabel>
                            <FormControl>
                              <ImageSetting
                                value={field.value}
                                onValueChange={(src) => field.onChange(src)}
                              />
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
                      image: "",
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
      </div>
    </div>
  );
};

export default GallerySectionSettingContent;
