import { Button } from "@/components/ui/button";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get } from "firebase/database";

import { useNavigate, useParams } from "react-router";
import RecipientCollapsible from "./components/RecipientCollapsible";

import { Spinner } from "@/components/ui/spinner";

import MessageConfiguration from "./components/MessageConfiguration";
import { ArrowLeft } from "lucide-react";
import ScheduleEditorDialog from "./components/ScheduleEditorDialog";

const SmsCampaignEditionPage = () => {
  const { campaignId } = useParams();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });
  const navigate = useNavigate();

  const { data, refetch } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.detailedCampaign()),
    queryFn: async () => {
      const doc = await get(keys.detailedCampaignRef());
      return doc.val() as TCampaign;
    },
    staleTime: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const promise = data?.recipients.map(async (item) => {
        if (!data.config?.message.text) {
          throw new Error("Please provide your message!");
        }

        return fetch(import.meta.env.VITE_BASE_URL + "/message-publishing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TopicArn: item.basicInfo.topicArn,
            message: data.config?.message.text ?? "Khong tim thay ",
            subject: "DAY LA SUBJECT",
          }),
        });
      });

      return await Promise.all(promise ?? []);
    },
  });

  const handleSendMessage = () => {
    mutation.mutate();
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <div className="left flex items-center gap-2">
          <Button
            variant={"ghost-primary"}
            className="rounded-2xl"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft />
          </Button>
          <strong>{data?.basicInfo.name}</strong>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="rounded-full"
            disabled={!data?.recipients.length || mutation.isPending}
            onClick={handleSendMessage}
            variant={"outline"}
          >
            {mutation.isPending && <Spinner />} Send test SMS
          </Button>
          <ScheduleEditorDialog initDate={data?.config?.schedule.date ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2  gap-10">
        <MessageConfiguration initialConfig={data?.config} />

        <div>
          <RecipientCollapsible initialRecipients={data?.recipients ?? []} />
        </div>
      </div>
    </div>
  );
};

export default SmsCampaignEditionPage;
