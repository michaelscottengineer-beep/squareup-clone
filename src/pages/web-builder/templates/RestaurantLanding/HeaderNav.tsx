import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { ChefHat } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import EditOverlay from "./EditOverlay";

const HeaderNav = () => {
  const navigation = useNavigate();

  const partEditorData = useEditorTemplateState(
    (state) => state.partEditorData
  );

  return (
    <nav
      className={cn("shadow-sm sticky top-0 z-50", {
        hidden: !!partEditorData?.header.hidden.data?.isChecked,
      })}
      style={{
        ...partEditorData.header.general?.style,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              style={{
                color: "inherit",
                ...partEditorData?.header?.pageName.style,
              }}
            >
              {partEditorData?.header?.pageName.text}
            </span>
          </div>
          <div className="flex gap-4">
            {partEditorData.header.navigation.data?.items?.map(
              (item: { label: string; url: string }) => {
                return (
                  <Button
                    key={item.label}
                    className=""
                    onClick={() => item.url && navigation(item.url)}
                    variant={"link"}
                    style={{
                      color: "inherit",
                    }}
                  >
                    {item.label}
                  </Button>
                );
              }
            )}
          </div>
        </div>
        {isEditing && <EditOverlay partEditorKey={"header"} />}
      </div>
    </nav>
  );
};

export default HeaderNav;
