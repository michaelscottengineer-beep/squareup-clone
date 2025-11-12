import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

const ImageUploadFrame = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange?: (base64String: string) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    value ?? ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        onValueChange?.(base64String);
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        className="rounded-md border border-dashed p-0 border-border bg-background hover:bg-background text-foreground w-20 h-20"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <img
            alt="preview img "
            className="w-full rounded-md object-cover aspect-square h-full"
            src={selectedImage}
          />
        ) : (
          <Plus />
        )}
      </Button>
    </>
  );
};


export default ImageUploadFrame