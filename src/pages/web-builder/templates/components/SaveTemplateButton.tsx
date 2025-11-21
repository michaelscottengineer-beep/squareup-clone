import { Button } from "@/components/ui/button";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
import useAuth from "@/hooks/use-auth";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { useMutation } from "@tanstack/react-query";
import { push, set } from "firebase/database";
import { UploadCloud } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface SaveTemplateButtonProps {
  templateName: string;
  outerHTML: string;
}
const SaveTemplateButton = ({
  templateName,
  outerHTML,
}: SaveTemplateButtonProps) => {
  const { user } = useAuth();
  const partData = useEditorTemplateState((state) => state.partEditorData);

  const mutate = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = push(keys.adminRootRef()).key;
      keys.addParams({ templateId: newTemplateKey });

      return await set(keys.adminDetailsRef(), {
        basicInfo: {
          name: templateName,
          createdBy: user?.uid,
        },
        outerHTML,
        partData,
      });
    },
    onSuccess: () => {
      toast.success('add template successfully!');
    },
  });

  if (user?.role !== "admin") return;

  return (
    <Button className="fixed bottom-5 right-5">
      <UploadCloud />
    </Button>
  );
};

export default SaveTemplateButton;
