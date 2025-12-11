import React, { createContext, useCallback, useState } from "react";

interface MailTemplateEditorContextProps {
  isEditing?: boolean;
  toggleEdit: (o: boolean) => void;
}
const MailTemplateEditorContext =
  createContext<MailTemplateEditorContextProps | null>(null);
const MailTemplateEditorProvider = ({ children }: React.PropsWithChildren) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback((o: boolean) => {
    setIsEditing(o);
  }, []);

  return (
    <MailTemplateEditorContext.Provider value={{ isEditing, toggleEdit }}>
      {children}
    </MailTemplateEditorContext.Provider>
  );
};

export { MailTemplateEditorContext, MailTemplateEditorProvider };
