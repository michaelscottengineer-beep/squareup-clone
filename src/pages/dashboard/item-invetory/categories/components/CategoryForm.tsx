"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, Settings2, Heart, Info, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CreateItemDialog from "./AssignItemsDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import { DialogClose } from "@/components/ui/dialog";
import type { TItem } from "@/types/item";
import { parseSegments } from "@/utils/helper";
import SelectParentCategoryDialog from "./SelectParentDialog";
import { useForm } from "react-hook-form";
import type { TCategory } from "@/types/category";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function CategoryForm() {
  const form = useForm<TCategory>({
    defaultValues: {
      basicInfo: {
        name: "",
        image: "",
      },
      items: [],
    },
  });
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pointsOfSaleEnabled, setPointsOfSaleEnabled] = useState(false);
  const [items, setItems] = useState<TItem[]>([]);
  const [parentId, setParentId] = useState("");

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      let prefix = parseSegments("/restaurants/", restaurantId, "/allGroups");
      const categoriesRef = ref(db, prefix);
      const newCategoriesRef = push(categoriesRef);

      const categoryId = newCategoriesRef.key;

      prefix = parseSegments(prefix, categoryId);

      for (const item of items) {
        const itemRef = ref(db, parseSegments(prefix, "/items/", item.id));
        await set(itemRef, item);
      }

      const basicInfoRef = ref(db, parseSegments(prefix, "/basicInfo"));

      await set(basicInfoRef, {
        name: categoryName,
        image: "",
        parentId,
      });
    },
    onSuccess: () => {
      toast.success("Create successfully!");
      queryClient.invalidateQueries({
        queryKey: ["restaurants", restaurantId, "allGroups"],
      });
      navigate(-1);
    },
    onError: (err) => {
      toast.error("Error: " + err.message);
    },
  });

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

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between h-max mb-4">
        <DialogClose className="">
          <Button variant={"secondary"} className="rounded-full">
            <X />
          </Button>
        </DialogClose>
        <Button
          className="rounded-full px-5 py-3 w-20"
          onClick={() => mutation.mutate()}
        >
          Save
        </Button>
      </div>

      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">Create category</h1>

        <div className="mb-8">
          <Input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
        <SelectParentCategoryDialog
          defaultValue={parentId}
          onChange={setParentId}
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
                  {items.length === 0
                    ? "None selected"
                    : items.map((it) => it.name).join(",")}
                </p>
              </div>
            </div>
            <CreateItemDialog onSubmit={setItems} />
          </div>
        </div>

        <div className="mb-8 pb-6 border-b border-border"></div>

        {/* Sales Channels and Hours */}
        {parentId === "0" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">Sales channels and hours</h2>

            {/* Points of Sale */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3 flex-1">
                <div className="text-foreground text-lg">📍</div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Points of sale
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Categories appear on Standard mode and Retail mode only.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={pointsOfSaleEnabled}
                  onCheckedChange={setPointsOfSaleEnabled}
                />
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
