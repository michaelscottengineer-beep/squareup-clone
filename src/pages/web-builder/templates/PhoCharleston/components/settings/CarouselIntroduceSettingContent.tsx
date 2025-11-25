import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import SheetSettingHeader from "@/components/templates/SheetSettingHeader";
import { useFieldArray, useForm } from "react-hook-form";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageSetting from "@/components/templates/settings/ImageSetting";
import SettingSection from "@/components/templates/settings";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type TCarouselItem = {
  img: string;
  buttonText: string;
  buttonUrl: string;
  title: string;
  subTitle: string;
};
type TFormValues = {
  items: TCarouselItem[];
};
const CarouselIntroduceSettingContent = () => {
  const carouselIntroduceData = usePhoCharlestonEditor(
    (state) => state.sections["carouselIntroduce"].elements
  );

  const carousel = carouselIntroduceData.carousel;
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
    if (carousel.data?.items)
      form.reset({
        items: carousel.data.items,
      });
  }, [carousel.data?.items]);

  const onSubmit = (data: TFormValues) => {
    setSection("carouselIntroduce", {
      carousel: {
        ...carousel,
        data: {
          ...carousel.data,
          items: data.items,
        },
      },
    });
  };

  return (
    <div>
      <SheetSettingHeader title="Section Setting" />
      <div className="p-4">
        <SettingSection label="Carousel Items">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="flex flex-col gap-3  max-h-[200px] overflow-y-auto">
                {fields.map((item, i) => {
                  return (
                    <InputGroup key={i + 1}>
                      <InputGroupInput
                        value={"Slide show " + (i + 1)}
                        disabled
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <InputGroupButton>
                              <Edit />
                            </InputGroupButton>
                          </DialogTrigger>
                          <DialogContent>
                            <div className="grid grid-cols-1 gap-2">
                              <FormField
                                control={form.control}
                                name={`items.${i}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`items.${i}.subTitle`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>SubTitle</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`items.${i}.buttonText`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Button Text</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`items.${i}.buttonUrl`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Redirect Url</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`items.${i}.img`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                      <ImageSetting
                                        value={field.value}
                                        onValueChange={(src) => {
                                          field.onChange(src);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex gap-4 w-full ">
                                <Button
                                  variant={"destructive"}
                                  onClick={() => {
                                    remove(i);
                                  }}
                                  className="basis-1/2"
                                >
                                  <Trash2 />
                                </Button>

                                <DialogClose asChild>
                                  <Button
                                    variant={"secondary"}
                                    onClick={() => {
                                      remove(i);
                                    }}
                                    className="basis-1/2"
                                  >
                                    Close <X />
                                  </Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </InputGroupAddon>
                    </InputGroup>
                  );
                })}
              </div>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      buttonText: "",
                      buttonUrl: "",
                      title: "",
                      subTitle: "",
                      img: "",
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

export default CarouselIntroduceSettingContent;
