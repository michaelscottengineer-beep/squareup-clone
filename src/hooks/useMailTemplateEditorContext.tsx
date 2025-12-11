import { MailTemplateEditorContext } from "@/contexts/mailTemplateEditorContext";
import { useContext } from "react";

const useMailTemplateEditorContext = () => {
  const context = useContext(MailTemplateEditorContext);

  if (!context)
    throw new Error('Used "useMailTemplateEditorContext inside Context!"');

  return context;
};

export default useMailTemplateEditorContext