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
import { useParams } from "react-router";
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

type TFormValue = Pick<TCampaign, "emailConfiguration">;

const SubjectSetup = () => {
  const { campaignId } = useParams();
  const queryClient = useQueryClient();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const form = useForm<TFormValue>({
    defaultValues: {
      emailConfiguration: {
        subject: {
          mainText: "",
          previewText: "",
        },
      },
    },
  });

  const { data: initSubjectConfig } = useQuery({
    queryKey: convertSegmentToQueryKey(
      keys.detailedCampaign() + "/emailConfiguration/subject"
    ),
    queryFn: async () => {
      const doc = await get(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/subject")
      );

      return doc.val() as TEmailSubject;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TFormValue) => {
      return await set(
        ref(db, keys.detailedCampaign() + "/emailConfiguration/subject"),
        data.emailConfiguration?.subject
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

  useEffect(() => {
    if (initSubjectConfig) {
      form.reset({
        emailConfiguration: {
          subject: {
            ...form.getValues("emailConfiguration.subject"),
            ...initSubjectConfig,
          },
        },
      });
    }
  }, [initSubjectConfig]);

  const onSubmit = (data: TFormValue) => {
    mutation.mutate(data);
  };

  return (
    <EditorWrapper
      title="Subject"
      description={"Add a subject line for this campaign."}
      triggerText={initSubjectConfig?.mainText ? "View" : "Add subject"}
      isValid={!!initSubjectConfig?.mainText}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="emailConfiguration.subject.mainText"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Subject line</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="emailConfiguration.subject.previewText"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Preview text</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>

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

export default SubjectSetup;
