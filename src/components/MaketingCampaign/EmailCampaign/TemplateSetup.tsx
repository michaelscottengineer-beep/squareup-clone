import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign, TContactList, TMailTemplate } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import EditorWrapper from "./EditorWrapper";
import TemplateSelector from "./TemplateSelector";

const TemplateSetup = () => {
  const { campaignId } = useParams();
  const queryClient = useQueryClient();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const [template, setTemplate] = useState<TMailTemplate | undefined>(
    undefined
  );

  const { data: initTemplate, refetch } = useQuery({
    queryKey: convertSegmentToQueryKey(
      keys.detailedCampaign() + "/emailConfiguration/template"
    ),
    queryFn: async () => {
      const doc = await get(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/template")
      );

      return doc.val() as TMailTemplate;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return await set(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/template"),
        template
      );
    },
    onSuccess: () => {
      toast.success("Saved successfully!");
      queryClient.invalidateQueries({
        queryKey: convertSegmentToQueryKey(keys.detailedCampaign()),
      });
      refetch();
    },
    onError: (err) => {
      toast.error("Saved error: " + err.message);
    },
  });

  useEffect(() => {
    setTemplate(initTemplate);
  }, [initTemplate]);

  return (
    <EditorWrapper
      title="Template Content"
      description={"Add template"}
      triggerText={initTemplate ? "Edit Content" : "Add"}
      isValid={!!initTemplate}
    >
      <div>
        <h3 className="text-lg font-medium">Send to</h3>
        <TemplateSelector
          value={template}
          onValueChange={(val) => {
            setTemplate(val);
            console.log(val);
          }}
        />
      </div>

      <footer className="col-footer flex items-end mt-4 w-full justify-between">
        <div className="flex flex-col gap-2"></div>
        <div className="flex gap-2">
          <CollapsibleTrigger>
            <Button variant={"outline"}>Cancel</Button>
          </CollapsibleTrigger>
          <Button
            className="ghost"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />} Save
          </Button>
        </div>
      </footer>
    </EditorWrapper>
  );
};

export default TemplateSetup;
