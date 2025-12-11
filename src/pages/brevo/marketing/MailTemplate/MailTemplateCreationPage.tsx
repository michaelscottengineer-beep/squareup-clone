import { PlateEditor } from "@/components/editor/plate-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TMailTemplate } from "@/types/brevo";
import { useMutation } from "@tanstack/react-query";
import { push } from "firebase/database";
import type { Value } from "platejs";
import { serializeHtml } from "platejs/static";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MailTemplateCreationPage = () => {
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState<any>();
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const mutation = useMutation({
    mutationFn: async () => {

      const fb = push(keys.allMailTemplatesRef(), {
        basicInfo: {
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        config: {
          html:"",
          subject,
        },
      } as TMailTemplate);

      const sv = fetch(import.meta.env.VITE_BASE_URL + "/create-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, subject, content: "" }),
      });
      return await Promise.all([fb, sv]);
    },
    onSuccess: () => {
      toast.success("Created successfully!");
      navigate(-1);
    },
    onError: (err) => {
      toast.error("Created error: " + err.message);
    },
  });

  return (
    <div className="space-y-4 p-10">
      <div className="flex justify-end">
        <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending && <Spinner />} Create template
        </Button>
      </div>
      <div>
        <Label className="mb-2">Template Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label className="mb-2">Your Subject</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
  
    </div>
  );
};

export default MailTemplateCreationPage;
