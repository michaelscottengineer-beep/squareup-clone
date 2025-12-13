import React, { useState } from "react";
import { Button } from "../ui/button";
import useMailTemplateEditorContext from "@/hooks/useMailTemplateEditorContext";
import useAuth from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { ref, set } from "firebase/database";
import { db } from "@/firebase";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import UploadImageArea from "../UploadImageArea";
import { toast } from "sonner";

const EditorHeader = () => {
  const { emailTemplate } = useMailTemplateEditorContext();
  const { user } = useAuth();
  const [imgUrl, setImgUrl] = useState("");

  const { mutate: publish, isPaused: isPublishing } = useMutation({
    mutationFn: async () => {
      const templateEditorElement = document.querySelector(
        "#main-template-editor"
      );

      return await set(ref(db, "systemMailTemplates/templateTest1"), {
        basicInfo: {
          name: "Template Test 1",
          createdAt: new Date().toISOString(),
          previewImageUrl: imgUrl,
        },
        data: {
          html: templateEditorElement ? templateEditorElement.outerHTML : "",
          tree: emailTemplate,
        },
      });
    },
    onSuccess: () => {
      toast.success("Published successfully!");
    },
    onError: (err) => {
      toast.error("Published error: " + err.message);
    },
  });

  return (
    <div className="flex justify-end p-4 border-b border-border gap-4">
      <Button className="bg-purple-400" size={"sm"}>
        Save&Quit
      </Button>

      {user?.role === "admin" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"sm"}>Publish</Button>
          </DialogTrigger>

          <DialogContent>
            <Label>Preview Image</Label>
            <UploadImageArea
              value={imgUrl}
              onValueChange={(url) => setImgUrl(url)}
            />

            <DialogFooter>
              <Button onClick={() => publish()} disabled={isPublishing}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EditorHeader;
