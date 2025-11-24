import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
import useAuth from "@/hooks/use-auth";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { useMutation } from "@tanstack/react-query";
import { push, set } from "firebase/database";
import { UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface AdminPublishForUserButtonProps {
  templateName: string;
  outerHTML: React.RefObject<HTMLDivElement | null>;
}
const AdminPublishForUserButton = ({
  templateName,
  outerHTML,
}: AdminPublishForUserButtonProps) => {
  const { user } = useAuth();
  const [iTemplateName, setITemplateName] = useState("");

  const partData = useEditorTemplateState((state) => state.partEditorData);
  const mutate = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = push(keys.adminRootRef()).key;
      keys.addParams({ templateId: newTemplateKey });

      return await set(keys.adminDetailsRef(), {
        basicInfo: {
          name: iTemplateName,
          createdBy: user?.uid,
        },
        outerHTML: outerHTML.current?.outerHTML,
        partData,
      });
    },
    onSuccess: () => {
      toast.success("add template successfully!");
    },
  });

  if (user?.role !== "admin") return;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-5 right-5">
          <UploadCloud />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-2 mb-2">
          <Label>Template Name</Label>
          <Input
            value={iTemplateName}
            onChangeCallback={(val) => setITemplateName(val)}
          />
        </div>
        <Button onClick={() => mutate.mutate()}>Done</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPublishForUserButton;
