import type { columnLayouts } from "@/data/mailTemplateEditor";
import React, { createContext, useCallback, useState } from "react";

interface MailTemplateEditorContextProps {
  emailTemplate: any;
  setEmailTemplate: (emlt: any) => void;
  selectedElement: any;
  setSelectedElement: (data: { layout: any; index: number } | null) => void;
}
const MailTemplateEditorContext =
  createContext<MailTemplateEditorContextProps | null>(null);
const MailTemplateEditorProvider = ({
  children,
  initEmailTemplate,
}: React.PropsWithChildren<{
  initEmailTemplate: any;
}>) => {
  const [emailTemplate, setEmailTemplate] = useState(initEmailTemplate);
  const [selectedElement, setSelectedElement] = useState<{
    layout: any;
    index: number;
  } | null>(null);

  return (
    <MailTemplateEditorContext.Provider
      value={{
        emailTemplate,
        setEmailTemplate,
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </MailTemplateEditorContext.Provider>
  );
};

export { MailTemplateEditorContext, MailTemplateEditorProvider };
