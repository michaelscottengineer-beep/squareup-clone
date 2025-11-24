import { Button } from "@/components/ui/button";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
import { db } from "@/firebase";
import useAuth from "@/hooks/use-auth";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import { parseSegments } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import { push, ref, set, update } from "firebase/database";
import { Save, UploadCloud } from "lucide-react";
import React from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

interface SaveTemplateButtonProps {
  outerHTMLRef: React.RefObject<HTMLDivElement | null>;
}
const SaveTemplateButton = ({ outerHTMLRef }: SaveTemplateButtonProps) => {
  const { user } = useAuth();
  const { templateId } = useParams();
  const partData = useEditorTemplateState((state) => state.partEditorData);

  const mutate = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      keys.addParams({ templateId: templateId });

      const updates: { [key: string]: any } = {};
      updates[parseSegments(keys.adminDetails(), "outerHTML")] =
        outerHTMLRef.current?.outerHTML;
      updates[parseSegments(keys.adminDetails(), "partData")] = partData;

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Save template successfully!");
    },
    onError: () => {
      toast.error('error when save')
    }
  });

  if (user?.role !== "admin") return;

  return (
    <Button className="fixed bottom-5 right-5" onClick={() => mutate.mutate()}>
      <Save /> Save & Publish
    </Button>
  );
};

export default SaveTemplateButton;
