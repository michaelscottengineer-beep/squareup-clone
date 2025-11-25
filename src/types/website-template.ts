import type { TTemplateEditorStateStore } from "@/stores/template-editor/usePhoCharlestonEditor";
import type { TPartEditorData } from "@/stores/use-editor-template-state";

export type TWebsiteTemplate = {
  id: string;
  basicInfo: {
    name: string;
    imgUrl: string;
    createdBy: string;
  };
  outerHTML: string;
  partData: TPartEditorData;
};

export type TWebsite = {
  id: string;
  basicInfo: {
    name: string;
    imgUrl: string;
    createdBy: string;
    templateId: string;
  };
  outerHTML: string;
  partData: TTemplateEditorStateStore;
};
