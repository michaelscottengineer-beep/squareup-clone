import "@/styles/website.css";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import useEditorTemplateState from "@/stores/use-editor-template-state";
import type { TWebsiteTemplate } from "@/types/website-template";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { User } from "lucide-react";
import useAuth from "@/hooks/use-auth";

const WebSitePage = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const setPartData = useEditorTemplateState((state) => state.set);
  const { user } = useAuth();

  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: item, isLoading } = useQuery({
    queryKey: ["users", restaurantId, "website-templates", websiteId, "page"],
    queryFn: async () => {
      try {
        const path = parseSegments("website-templates", websiteId);

        const templatesRef = ref(db, path);

        const snap = await get(templatesRef);

        return { ...snap.val(), id: websiteId } as TWebsiteTemplate;
      } catch (err) {
        console.error(err);
      }
    },
    select: (data) => {
      if (data) setPartData(data.partData);
      return data;
    },
    enabled: !!restaurantId && !!websiteId,
  });

  if (isLoading) return <div>Loading ...</div>;
  return (
    <div id="website-page">
      <div dangerouslySetInnerHTML={{ __html: item?.outerHTML ?? "" }}></div>
    </div>
  );
};

export default WebSitePage;
