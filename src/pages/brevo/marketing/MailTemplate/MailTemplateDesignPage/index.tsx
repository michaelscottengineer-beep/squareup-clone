import MailTemplate1 from "@/components/MaketingCampaign/MailTemplates/MailTemplate1";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useTemplate1Editor from "@/stores/template-editor/useTemplate1Editor";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TRootMailTemplate } from "@/types/brevo";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { get, query, ref } from "firebase/database";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const MailTemplateDesignPage = () => {
  const { mailTemplateId, designId } = useParams();
  const navigate = useNavigate();
  const setIsEditing = useTemplate1Editor((state) => state.toggleEdit);
  const setAllData = useTemplate1Editor((state) => state.setAllData);
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, mailTemplateId });

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(
      keys.detailedMailTemplate() + "/rootMailTemplate"
    ),
    queryFn: async () => {
      try {
        const smsQuery = query(
          ref(db, keys.detailedMailTemplate() + "/rootMailTemplate")
        );
        const doc = await get(smsQuery);

        return doc.val() as TRootMailTemplate;
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    if (data) {
      setIsEditing(true);
      setAllData({
        footer: data.rawData.footer,
        header: data.rawData.header,
        sections: data.rawData.sections,
      });
    }
  }, [data]);

  return (
    <div className="grid grid-cols-2">
      <div></div>
      <div>
        <MailTemplate1 />
      </div>
    </div>
  );
};

export default MailTemplateDesignPage;
