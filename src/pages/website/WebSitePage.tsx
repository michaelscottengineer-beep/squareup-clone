import "@/styles/website.css";
import { db } from "@/firebase";
import type { TWebsite, TWebsiteTemplate } from "@/types/website-template";
import { parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "@/hooks/use-auth";

const WebSitePage = () => {
  const { websiteId } = useParams();
  const { user } = useAuth();


  const { data: item, isLoading } = useQuery({
    queryKey: ["users", user?.uid, "websites", websiteId, "published"],
    queryFn: async () => {
      try {
        const path = parseSegments("websites", websiteId);

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return { ...snap.val(), id: websiteId } as TWebsite;
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!websiteId,
  });

  if (isLoading) return <div>Loading ...</div>;
  return (
    <div id="website-page">
      <div dangerouslySetInnerHTML={{ __html: item?.outerHTML ?? "" }}></div>
    </div>
  );
};

export default WebSitePage;
