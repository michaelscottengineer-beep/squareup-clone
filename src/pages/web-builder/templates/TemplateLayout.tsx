import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import useAuth from "@/hooks/use-auth";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TWebsiteTemplate } from "@/types/website-template";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, push, ref } from "firebase/database";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const TemplateLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: items, isLoading } = useQuery({
    queryKey: ["users", "website-templates"],
    queryFn: async () => {
      try {
        const path = parseSegments("website-templates");

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return snap.val()
          ? convertFirebaseArrayData<TWebsiteTemplate>(snap.val())
          : [];
      } catch (err) {
        console.error(err);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (template: TWebsiteTemplate) => {
      const webRef = ref(db, parseSegments("websites", user?.uid));

      const res = await push(webRef, {
        outerHTML: "",
        basicInfo: {
          templateId: template.id,
          name: template.basicInfo.name,
          imgUrl: template.basicInfo.name,
          createdBy: user?.uid,
        },
        partData: template.partData,
      });
      return res.key;
    },
    onSuccess: (key) => {
      toast.success("Use successfully!");
      navigate(`/websites/${key}/editor`);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error! " + err.message);
    },
  });

  return (
    <div className="grid grid-cols-4 p-10">
      {items?.map((item) => {
        return (
          <div key={item.id} className="flex flex-col">
            <img src={item.basicInfo.imgUrl} alt="template img" />
            <span className="font-bold text-xl ">{item.basicInfo.name}</span>
            <Button onClick={() => mutation.mutate(item)}>Use Template</Button>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateLayout;
