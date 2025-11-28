import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload, Settings2, Heart, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateItemDialog from "./components/AssignItemsDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, push, ref, set, update } from "firebase/database";
import { db } from "@/firebase";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import type { TItem } from "@/types/item";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
  initFirebaseUpdateVariable,
  parseSegments,
} from "@/utils/helper";
import SelectParentCategoryDialog from "./components/SelectParentDialog";
import { useForm } from "react-hook-form";
import type { TCategory, TCategoryDocumentData } from "@/types/category";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CategoryChannelSelection from "./components/CategoryChannelSelection";
import { toast } from "sonner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";

export default function CategoryFormPage() {
  const { cateId } = useParams();
  const navigate = useNavigate();
  const form = useForm<TCategory>({
    defaultValues: {
      basicInfo: {
        name: "",
        image: "",
        hasChannel: false,
      },
      items: [],
    },
  });
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, categoryId: cateId });

  const { data: category } = useQuery({
    queryKey: [...convertSegmentToQueryKey(keys.allGroups()), cateId],
    queryFn: async () => {
      const cateRef = keys.detailedCategoryRef();
      const data = await get(cateRef);
      return data;
    },
    enabled: !!cateId && !!restaurantId,
  });

  const mutation = useMutation({
    mutationFn: async (formData: TCategory) => {
      let categoryId = null;
      let prefix = keys.allGroups();

      if (!cateId) {
        const categoriesRef = ref(db, keys.allGroups());
        const newCategoriesRef = push(categoriesRef);
        categoryId = newCategoriesRef.key;
      } else categoryId = cateId;

      keys.setParams({ categoryId });
      prefix = keys.detailedCategory();

      const updates = initFirebaseUpdateVariable();
      for (const item of formData.items) {
        // const itemRef = ref(db, );
        // await set(itemRef, item);
        updates[parseSegments(prefix, "/items/", item.id)] = item;
      }

      // const basicInfoRef = ref(db, parseSegments(prefix, "/basicInfo"));
      updates[keys.categoryBasicInfo()] = formData.basicInfo;
      // await set(basicInfoRef, formData.basicInfo);

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Create successfully!");
      queryClient.invalidateQueries({
        queryKey: convertSegmentToQueryKey(keys.allGroups()),
      });
      navigate(-1);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error: " + err.message);
    },
  });

  useEffect(() => {
    if (!category) return;
    const ret = category.val() as TCategoryDocumentData;
    if (!ret) return;
    form.reset({
      ...form.getValues(),
      ...ret,
      basicInfo: {
        ...form.getValues('basicInfo'),
        ...ret.basicInfo,
      },
      items: convertFirebaseArrayData<TItem>(ret.items),
    });
  }, [category]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: TCategory) => {
    mutation.mutate(data);
  };

  return (
    <Dialog
      open={!!cateId}
      onOpenChange={(o) => {
        if (!o) navigate(-1);
      }}
    >
      <DialogContent
        className="max-w-screen! rounded-none h-screen"
        showCloseButton={false}
      >
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-row items-center justify-between h-max mb-4">
              <DialogClose className="">
                <Button variant={"secondary"} className="rounded-full">
                  <X />
                </Button>
              </DialogClose>
              <Button className="rounded-full px-5 py-3 w-20" type={"submit"}>
                Save
              </Button>
            </div>

            <div className="w-full max-w-lg mx-auto">
              {/* Header */}
              <h1 className="text-3xl font-bold mb-8">Create category</h1>

              <div className="mb-8">
                <FormField
                  control={form.control}
                  name={`basicInfo.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Category name"
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-lg p-8 mb-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:border-primary/50"
                }`}
              >
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="w-full text-center">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected category"
                      className="h-24 w-24 object-cover rounded-lg mx-auto mb-3"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click or drag to change image
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">
                        Drag an image here
                      </span>
                      ,{" "}
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm font-normal underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        upload
                      </Button>{" "}
                      or{" "}
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm font-normal underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse image library
                      </Button>
                      .
                    </p>
                  </div>
                )}
              </div>

              {/* Parent Category */}
              <FormField
                control={form.control}
                name={`basicInfo.parentId`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectParentCategoryDialog
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Items Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Items</h2>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground">Items</h3>
                      <p className="text-sm text-muted-foreground">
                        {form.getValues("items")?.length === 0
                          ? "None selected"
                          : form
                              .getValues("items")
                              .map((it) => it.name)
                              .join(",")}
                      </p>
                    </div>
                  </div>
                  <CreateItemDialog
                    onSubmit={(items) => form.setValue("items", items)}
                  />
                </div>
              </div>

              <div className="mb-8 pb-6 border-b border-border"></div>

              {/* Sales Channels and Hours */}
              {form.getValues("basicInfo.parentId") === "" && (
                <FormField
                  control={form.control}
                  name={`basicInfo.hasChannel`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CategoryChannelSelection
                          onCheckedChange={field.onChange}
                          checked={!!field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
