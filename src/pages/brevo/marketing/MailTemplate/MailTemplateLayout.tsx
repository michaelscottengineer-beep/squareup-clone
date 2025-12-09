import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import { cn } from "@/lib/utils";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import {
  convertFirebaseArrayData,
  convertSegmentToQueryKey,
} from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { equalTo, get, orderByChild, query } from "firebase/database";
import React, { useState } from "react";
import type { TCampaign, TMailTemplate } from "@/types/brevo";
import { CreateCampaignDrawer } from "@/components/MaketingCampaign";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

class MailTemplateLayout extends React.Component {
  state = {
    tabs: "Email",
  };

  render() {
    return (
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl mb-10 font-medium ">Mail Templates</h1>
          <CreateButton />
        </div>

        <div>
          <Tabs
            defaultValue={this.state.tabs}
            onValueChange={(tab) => this.setState({ tabs: tab })}
          >
            <TabsList className="border-border border-b bg-background shadow-none w-full justify-start flex p-0 ">
              <TabsTrigger
                value={"Email"}
                className={cn(
                  "border-0 w-max max-w-max! rounded-none shadow-none!",
                  {
                    "border-b  border-primary  text-primary":
                      this.state.tabs === "Email",
                  }
                )}
              >
                <div className=" rounded-none hover:rounded-md hover:bg-primary/10 hover:text-primary py-1 px-4 ">
                  Email
                </div>
              </TabsTrigger>
            </TabsList>

            <EmailListView />
          </Tabs>
        </div>
      </div>
    );
  }
}

const CreateButton = () => {
  const navigate = useNavigate();

  return (
    <Button
    className="rounded-full"
      onClick={() => {
        navigate("/brevo/mail-templates/new");
      }}
    >
      Create template
    </Button>
  );
};
const EmailListView = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId });

  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allMailTemplates()),
    queryFn: async () => {
      try {
        const smsQuery = query(
          keys.allCampaignsRef(),
          orderByChild("basicInfo/type"),
          equalTo("sms")
        );
        const docs = await get(smsQuery);

        return convertFirebaseArrayData<TMailTemplate>(docs.val());
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <TabsContent value="Email" className="space-y-4">
      {/* {data?.map((item) => {
        return (
          <SmsCampaignListItem
            key={item.id}
            item={item.basicInfo}
            id={item.id}
          />
        );
      })} */}
    </TabsContent>
  );
};

export default MailTemplateLayout;
