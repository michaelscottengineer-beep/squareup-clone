import type { TPartEditorData } from "@/stores/use-editor-template-state";

export type TWebsiteTemplate = {
  id: string;
  basicInfo: {
    name: string;
    createdBy: string;
  };
  outerHTML: string;
  partData: TPartEditorData;
};
