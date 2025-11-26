import { Input } from "@/components/ui/input";
import imgbbService from "@/services/imggbb.service";
import React, { useState } from "react";
import { toast } from "sonner";
import UploadImageArea from "@/components/UploadImageArea";

const TestUploadImage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        // Remove the data:image/jpeg;base64, prefix if needed
        const base64Data = base64String.split(',')[1];
        try {
          const response = await imgbbService.upload(base64Data);
          setSelectedImage(response.image.url);
          toast.success("uploaded success")
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("uploaded error")
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />

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
      ) : null}

      <UploadImageArea />
    </div>
  );
};

export default TestUploadImage;
