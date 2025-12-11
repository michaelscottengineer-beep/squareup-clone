import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TMailTemplate, TRootMailTemplate } from "@/types/brevo";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, push, query, ref, set } from "firebase/database";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type TFormValue = TMailTemplate;

const MailTemplateEdit = () => {
  const { mailTemplateId } = useParams();

  return (
    <div className="p-10">
      <Tabs defaultValue="setup">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <SetupForm />
        </TabsContent>

        <TabsContent value="design">
          <DesignTabs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DesignTabs = () => {
  const { mailTemplateId } = useParams();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, mailTemplateId });
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey("/allMailTemplates"),
    queryFn: async () => {
      try {
        const tlqr = query(ref(db, "/allMailTemplates"));
        const docs = await get(tlqr);

        return convertFirebaseArrayData<TRootMailTemplate>(docs.val() ?? {});
      } catch (err) {
        console.log(err);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TRootMailTemplate) => {
      return await set(
        ref(db, keys.detailedMailTemplate() + "/rootMailTemplate"),
        data
      );
    },
    onSuccess: (data, variables) => {
      toast.success("Used successfully!");
      navigate("/brevo/mail-templates/" + mailTemplateId + "/design");
    },
    onError: (err) => {
      toast.error("Used error: " + err.message);
    },
  });

  return (
    <div>
      {data?.map((item) => {
        return (
          <div
            key={item.id}
            className="p-2 max-w-[300px] border border-border rounded-md"
          >
            <img
              src={item.imgUrl}
              className=""
              style={{ aspectRatio: 3 / 4 }}
            />

            <Button className="w-full!" onClick={() => mutation.mutate(item)}>
              Use this template
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const SetupForm = () => {
  const { mailTemplateId } = useParams();
  const form = useForm<TFormValue>({});

  const navigate = useNavigate();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, mailTemplateId });

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.detailedMailTemplate()),
    queryFn: async () => {
      try {
        const smsQuery = query(keys.detailedMailTemplateRef());
        const docs = await get(smsQuery);

        return docs.val() as TMailTemplate;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TFormValue) => {
      return await set(keys.detailedMailTemplateRef(), data as TMailTemplate);
    },
    onSuccess: () => {
      toast.success("Save successfully!");
      navigate(-1);
    },
    onError: (err) => {
      toast.error("Save error: " + err.message);
    },
  });

  useEffect(() => {
    if (data) form.reset({ ...form.getValues(), ...data });
  }, [data]);

  const onSubmit = (data: TFormValue) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-10">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="basicInfo.name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="config.subject"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Subject Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button disabled={mutation.isPending}>
            {mutation.isPending && <Spinner />} Save setup
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default MailTemplateEdit;
