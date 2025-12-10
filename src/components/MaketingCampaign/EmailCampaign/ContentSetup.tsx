import ListSelector from "@/components/ListSelector";
import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";

import { Spinner } from "@/components/ui/spinner";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign, TContactList, TEmailSubject } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import EditorWrapper from "./EditorWrapper";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PlateEditor } from "@/components/editor/plate-editor";
import { serializeHtml } from "platejs/static";
import type { Value } from "platejs";

type TFormValue = Pick<TCampaign, "emailConfiguration">;

const ContentSetup = () => {
  const { campaignId } = useParams();
  const queryClient = useQueryClient();
  const [value, setValue] = useState<{
    value: Value;
    editor: any;
  }>();

  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const form = useForm<TFormValue>({
    defaultValues: {
      emailConfiguration: {
        html: "",
      },
    },
  });

  const { data: initHTML } = useQuery({
    queryKey: convertSegmentToQueryKey(
      keys.detailedCampaign() + "/emailConfiguration/html"
    ),
    queryFn: async () => {
      const doc = await get(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/html")
      );
      const docVal = await get(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/value")
      );

      return {
        html: doc.val(),
        val: docVal.val(),
      } as { html: string; val: Value };
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TFormValue) => {
      const html = await serializeHtml(value?.editor, {});

      return await Promise.all([
        set(
          ref(db, keys.detailedCampaign() + "/emailConfiguration/html"),
          html
        ),
        set(
          ref(db, keys.detailedCampaign() + "/emailConfiguration/value"),
          value?.value
        ),
      ]);
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

  useEffect(() => {
    if (initHTML) {
      form.reset({
        emailConfiguration: {
          html: initHTML.html,
          value: initHTML.val
        },
      });
    }
  }, [initHTML]);

  const onSubmit = (data: TFormValue) => {
    mutation.mutate(data);
  };

  return (
    <EditorWrapper
      title="Content"
      description={"Add content for this campaign."}
      triggerText={initHTML ? "View" : "Add content"}
      isValid={!!initHTML}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <PlateEditor
            initValue={initHTML?.val}
            onValueChangeCallback={(value, editor) =>
              setValue({ value, editor })
            }
          />

          <footer className="col-footer flex items-end mt-4 w-full justify-between">
            <div className="flex flex-col gap-2"></div>
            <div className="flex gap-2">
              <CollapsibleTrigger>
                <Button variant={"ghost"}>Cancel</Button>
              </CollapsibleTrigger>
              <Button className="ghost" disabled={mutation.isPending}>
                {mutation.isPending && <Spinner />} Save
              </Button>
            </div>
          </footer>
        </form>
      </Form>
    </EditorWrapper>
  );
};

export default ContentSetup;
