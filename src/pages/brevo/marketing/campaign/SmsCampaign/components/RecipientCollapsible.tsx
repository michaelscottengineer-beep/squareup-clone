import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/button";

import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign, TContactList } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import SmsCampaignCollapsible from "../components/SmsCampaignCollapsible";

const RecipientCollapsible = ({
  initialRecipients,
}: {
  initialRecipients: TContactList[];
}) => {
  const { campaignId } = useParams();
  const queryClient = useQueryClient();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const [recipients, setRecipients] =
    useState<TContactList[]>(initialRecipients);

  const mutation = useMutation({
    mutationFn: async () => {
      return await set(
        ref(db, keys.detailedCampaign() + "/recipients"),
        recipients
      );
    },
    onSuccess: () => {
      toast.success("Saved successfully!");
      queryClient.invalidateQueries({
        queryKey: convertSegmentToQueryKey(keys.detailedCampaign()),
      });
    },
    onError: (err) => {
      toast.error("Saved error: " + err.message);
    },
  });

  const totalRecipients = useMemo(() => {
    return recipients.reduce((acc, cur) => {
      return (acc = acc + Object.keys(cur?.contacts ?? {}).length);
    }, 0);
  }, [recipients]);

  useEffect(() => {
    setRecipients(initialRecipients ?? []);
  }, [initialRecipients]);

  return (
    <SmsCampaignCollapsible
      title="Recipients"
      description="The people who receive your SMS"
      isValid={recipients.length > 0}
    >
      <div>
        <h3>Send to</h3>
        <ListSelector
          value={recipients}
          onValueChange={(val) => {
            setRecipients(val);
            console.log(val);
          }}
        />
      </div>

      <footer className="col-footer flex items-end mt-4 w-full justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg text-muted-foreground">
            Total Recipients
          </h2>
          <span className="font-semibold text-lg">{totalRecipients}</span>
        </div>
        <div className="flex gap-2">
          <Button
            className="ghost"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />} Save
          </Button>
        </div>
      </footer>
    </SmsCampaignCollapsible>
  );
};

export default RecipientCollapsible;
