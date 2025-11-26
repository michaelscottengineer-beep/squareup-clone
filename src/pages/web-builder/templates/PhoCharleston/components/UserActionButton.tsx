import usePhoCharlestonEditor from "@/stores/template-editor/usePhoCharlestonEditor";
import { Button } from "@/components/ui/button";
import { Edit, Save, UploadCloud, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
import { push, ref, set, update } from "firebase/database";
import { useParams } from "react-router";
import { parseSegments } from "@/utils/helper";
import useAuth from "@/hooks/use-auth";
import { db } from "@/firebase";
import { toast } from "sonner";

const UserActionButton = ({
  templateId,
  outerHTML,
}: {
  templateId?: string;
  outerHTML: React.RefObject<HTMLDivElement | null>;
}) => {
  const { user } = useAuth();
  const { websiteId } = useParams();
  const header = usePhoCharlestonEditor((state) => state.header);
  const footer = usePhoCharlestonEditor((state) => state.footer);
  const sections = usePhoCharlestonEditor((state) => state.sections);

  const mutate = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = templateId;
      keys.addParams({ templateId: newTemplateKey });

      return await set(
        ref(db, parseSegments("websites", websiteId, "partData")),
        {
          header,
          footer,
          sections,
        }
      );
    },
    onSuccess: () => {
      toast.success("Save template successfully!");
    },
    onError: (err) => {
      toast.error("Save template Error successfully! " + err.message);
    },
  });

  const { mutate: publish } = useMutation({
    mutationFn: async () => {
      const keys = templateFirebaseKey({});
      const newTemplateKey = templateId;
      keys.addParams({ templateId: newTemplateKey });

      const updates: { [key: string]: any } = {};

      updates[parseSegments("websites",  websiteId, "partData")] = {
        header,
        footer,
        sections,
      };

      updates[parseSegments("websites",  websiteId, "outerHTML")] =
        outerHTML.current?.outerHTML;

      return await update(ref(db), updates);
    },
    onSuccess: () => {
      toast.success("Publish template successfully!");
    },
    onError: (err) => {
      toast.error("Publish template Error successfully! " + err.message);
    },
  });

  return (
    <div className="flex flex-col gap-2 fixed bottom-16 right-5">
      <Button className="bg-purple-500" onClick={() => mutate.mutate()}>
        <Save />
      </Button>
      <Button onClick={() => publish()}>
        <UploadCloud />
      </Button>
    </div>
  );
};
export default UserActionButton;
