import { Button } from "@/components/ui/button";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign, TContactList } from "@/types/brevo";
import { convertSegmentToQueryKey } from "@/utils/helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref, set } from "firebase/database";

import { useNavigate, useParams } from "react-router";
import RecipientCollapsible from "./components/RecipientCollapsible";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { db } from "@/firebase";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Edit } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import UploadImageArea from "@/components/UploadImageArea";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type TFormValue = Pick<TCampaign, "config">;

const SmsCampaignDesignMessagePage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });
  const form = useForm<TFormValue>({
    defaultValues: {
      config: {
        message: {
          text: "",
        },
        mms: {
          src: "",
        },
      },
    },
  });

  const imgSrcWatch = useWatch({
    control: form.control,
    name: "config.mms.src",
  });

  const messageWatch = useWatch({
    control: form.control,
    name: "config.message.text",
  });

  const { data, refetch } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.detailedCampaign()),
    queryFn: async () => {
      const doc = await get(keys.detailedCampaignRef());
      return doc.val() as TCampaign;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TFormValue) => {
      return await set(
        ref(db, keys.detailedCampaign() + "/config"),
        data.config
      );
    },
    onSuccess: () => {
      refetch();
      toast.success("Saved successfully!");
      navigate(-1);
    },
    onError: (err) => {
      toast.error("Saving failed: " + err.message);
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        config: {
          ...form.getValues(),
          ...data.config,
        },
      });
    }
  }, [data]);

  const onSubmit = (data: TFormValue) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <header className="items-center flex justify-between p-4">
          <div className="left flex items-center gap-2">
            <ArrowLeft />
            <h1 className="font-medium text-xl">{data?.basicInfo.name}</h1>
          </div>
          <div className="right ">
            <Button className="rounded-lg">Save</Button>
          </div>
        </header>
        <div className="content grid grid-cols-[auto_1fr] flex-1">
          <div className="editor min-w-[300px] px-5 space-y-3">
            <FormField
              control={form.control}
              name="config.message.text"
              render={({ field }) => {
                return (
                  <FormItem className="message">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea className="" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="config.mms.src"
              render={({ field }) => {
                return (
                  <FormItem className="mms">
                    <FormControl>
                      <UploadImageArea
                        onValueChange={(src) => field.onChange(src ?? "")}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="preview bg-muted/60 px-4 flex flex-col justify-center">
            {imgSrcWatch && (
              <img
                className=" max-w-xs rounded-lg mb-2"
                src={imgSrcWatch ?? ""}
                alt="preview-mms"
              />
            )}
            <Input
              value={messageWatch}
              disabled
              className="rounded-full bg-white "
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SmsCampaignDesignMessagePage;
