import SettingOverlay from "@/components/templates/SettingOverlay";
import { cn } from "@/lib/utils";
import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import React from "react";
import GallerySectionSettingContent from "./settings/GallerySectionSettingContent";

export const GallerySection = () => {
  const isEditing = usePhoCharlestonEditor((state) => state.isEditing);
  const sectionData = usePhoCharlestonEditor(
    (state) => state.sections["gallerySection"]
  );
  const gallerySectionElements = sectionData.elements;
  return (
    <div className="relative">
      <div className="grid grid-cols-5">
        {gallerySectionElements.gallery.data?.items.map(
          (item: any, i: number) => {
            return (
              <div
                key={i + 1}
                className={cn("h-full",{
                  "col-span-2 row-span-2": (i + 1) % 7 === 1,
                })}
              >
                <img src={item.image} alt="image" className="object-cover h-full" />
              </div>
            );
          }
        )}
      </div>

      {isEditing && (
        <SettingOverlay settingContent={<GallerySectionSettingContent />} />
      )}
    </div>
  );
};
