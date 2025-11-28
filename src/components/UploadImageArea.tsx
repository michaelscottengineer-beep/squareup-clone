"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import imgbbService from "@/services/imggbb.service";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface UploadImageAreaProps {
  value?: string;
  onValueChange?: (url: string) => void;
}

const UploadImageArea = ({ value, onValueChange }: UploadImageAreaProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    value ?? ""
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (base64String: string) => {
      const base64Data = base64String.split(",")[1];
      return await imgbbService.upload(base64Data);
    },
    onSuccess: (data, base64String) => {
      setSelectedImage(base64String);
      onValueChange?.(data.image.url as string);
      toast.success("uploaded success");
    },
    onError: (err) => {
      console.error("Error uploading image:", err);
      toast.error("uploaded error", {
        description: err.message,
      });
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        mutation.mutate(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        mutation.mutate(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setSelectedImage(value ?? "");
  }, [value]);

  return (
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
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-normal underline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Click
            </Button>{" "}
            or drag to change image
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
              type="button"
            >
              upload
            </Button>{" "}
            or{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-normal underline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              browse image library
            </Button>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadImageArea;
