import { db } from "@/firebase";
import useAuth from "@/hooks/use-auth";
import type { TWebsite, TWebsiteTemplate } from "@/types/website-template";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React from "react";
import { useNavigate, useParams } from "react-router";
import PhoCharleston from "../web-builder/templates/PhoCharleston";

const WebsiteEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { websiteId } = useParams();

  const { data: item, isLoading } = useQuery({
    queryKey: ["users", user?.uid, "websites", websiteId],
    queryFn: async () => {
      try {
        const path = parseSegments("websites", user?.uid, websiteId);

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return { ...snap.val(), id: websiteId } as TWebsite;
      } catch (err) {
        console.error(err);
      }
    },
  });

  if (!item && !isLoading) {
    return <div>Does not exists!</div>;
  }
  
  return (
    <div>
      {item?.basicInfo.templateId === "-Oetd5d1QjSd_6GNpA3W" && (
        <PhoCharleston isAllowedToEdit />
      )}
    </div>
  );
};

export default WebsiteEditor;
