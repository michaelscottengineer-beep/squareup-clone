import {
  RecipientSetup,
  SubjectSetup,
} from "@/components/MaketingCampaign/EmailCampaign";
import ContentSetup from "@/components/MaketingCampaign/EmailCampaign/ContentSetup";
import TemplateSetup from "@/components/MaketingCampaign/EmailCampaign/TemplateSetup";
import { Button } from "@/components/ui/button";
import {
  InputGroupInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type {
  TCampaign,
  TCampaignEmailConfig,
  TContactList,
} from "@/types/brevo";
import type { TRestaurantCustomer } from "@/types/restaurant";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";
import { ArrowLeft, Check, Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EmailCampaignEditorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 space-y-4">
      <header className="flex justify-between items-center gap-4">
        <div className="items-center flex gap-2">
          <Button
            className="rounded-2xl"
            variant={"ghost-primary"}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
          <Name />
        </div>

        <div>
          <SendMailButton />
        </div>
      </header>
      <div className="flex flex-col group relative space-y-4">
        <div className="overlay inset-0 absolute hidden group-has-data-[state='open']:bg-white/80 z-1 group-has-data-[state='open']:block w-full h-full"></div>
        <RecipientSetup />
        <SubjectSetup />
        {/* <ContentSetup /> */}
        <TemplateSetup />
      </div>
    </div>
  );
};

const SendMailButton = () => {
  const { campaignId } = useParams();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const { data: emailConfiguration, refetch } = useQuery({
    queryKey: convertSegmentToQueryKey(
      keys.detailedCampaign() + "/emailConfiguration"
    ),
    queryFn: async () => {
      const doc = await get(
        ref(db, keys.detailedCampaign() + "/emailConfiguration")
      );
      return (doc.val() ?? {}) as TCampaignEmailConfig;
    },
    staleTime: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const contacts = emailConfiguration?.recipients
        ?.map((r) =>
          Object.entries(r.contacts ?? {}).map(([key, val]) => {
            return val;
          })
        )
        .flat();
      return fetch(import.meta.env.VITE_BASE_URL + "/bulk-send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: contacts?.map((c) => c.email) ?? [],
          subject: emailConfiguration?.subject.mainText ?? "",
          content: emailConfiguration?.template.rootMailTemplate?.html ?? "",
        }),
      });
    },
    onSuccess: () => {
      toast.success("Sent successfully!");
    },
    onError: (err) => {
      toast.error("Sent failed: " + err.message);
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="rounded-full"
    >
      {mutation.isPending && <Spinner />} Send mail
    </Button>
  );
};
const Name = () => {
  const { campaignId } = useParams();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const [isEditName, setIsEditName] = useState(false);
  const [name, setName] = useState("");

  const { data, refetch } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.detailedCampaign() + "/basicInfo"),
    queryFn: async () => {
      const doc = await get(ref(db, keys.detailedCampaign() + "/basicInfo"));
      return doc.val() as TCampaign["basicInfo"];
    },
    staleTime: 30 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return await set(
        ref(db, keys.detailedCampaign() + "/basicInfo/name"),
        name
      );
    },
    onSuccess: () => {
      toast.success("Saved successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error("Saved error: " + err.message);
    },
  });

  useEffect(() => {
    setName(data?.name ?? "");
  }, [data]);

  return (
    <div className="flex items-center gap-2 rounded-md">
      {isEditName ? (
        <InputGroup>
          <InputGroupInput
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputGroupAddon align={"inline-end"}>
            <InputGroupText>{name.length}/155</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <div className="font-medium">{name}</div>
      )}

      {isEditName ? (
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost-primary"}
            size={"icon-sm"}
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <Check />
          </Button>
          <Button
            variant={"ghost-primary"}
            size={"icon-sm"}
            disabled={mutation.isPending}
            onClick={() => {
              setIsEditName(false);
              setName(data?.name ?? "");
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <Button variant={"ghost-primary"} onClick={() => setIsEditName(true)}>
          <Edit />
        </Button>
      )}
    </div>
  );
};
export default EmailCampaignEditorPage;
