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
import SmsCampaignListItem from "./components/SmsCampaignListItem";
import type { TCampaign } from "@/types/brevo";
import { CreateCampaignDrawer } from "@/components/MaketingCampaign";
import EmailCampaignListItem from "./components/EmailCampaignListItem";

class CampaignLayout extends React.Component {
  state = {
    tabs: "Email",
  };

  render() {
    return (
      <div className="p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl mb-10">Campaigns</h1>
          <CreateCampaignDrawer />
        </div>

        <div>
          <Tabs
            defaultValue={this.state.tabs}
            onValueChange={(tab) => this.setState({ tabs: tab })}
          >
            <TabsList className="border-border border-b bg-background shadow-none w-full justify-start flex p-0">
              <TabsTrigger
                value={"Email"}
                className={cn(
                  "border-0  rounded-none hover:rounded-md hover:bg-primary/10 hover:text-primary max-w-max! px-4",
                  {
                    "border-b  border-primary  text-primary":
                      this.state.tabs === "Email",
                  }
                )}
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="SMS"
                className={cn(
                  "border-0 rounded-none hover:rounded-md hover:bg-primary/10 hover:text-primary max-w-max! px-4",
                  {
                    "border-b  border-primary  text-primary":
                      this.state.tabs === "SMS",
                  }
                )}
              >
                SMS
              </TabsTrigger>
            </TabsList>

            <EmailCampaignTabsContent />
            <SmsCampaignTabsContent />
          </Tabs>
        </div>
      </div>
    );
  }
}

const SmsCampaignTabsContent = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allCampaigns() + "/with-sms"),
    queryFn: async () => {
      try {
        const smsQuery = query(
          keys.allCampaignsRef(),
          orderByChild("basicInfo/type"),
          equalTo("sms")
        );
        const docs = await get(smsQuery);

        return convertFirebaseArrayData<TCampaign>(docs.val());
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <TabsContent value="SMS" className="space-y-4">
      {data?.map((item) => {
        return (
          <SmsCampaignListItem
            key={item.id}
            item={item.basicInfo}
            id={item.id}
          />
        );
      })}
    </TabsContent>
  );
};

const EmailCampaignTabsContent = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const keys = useRestaurantFirebaseKey({ restaurantId });
  const { data } = useQuery({
    queryKey: convertSegmentToQueryKey(keys.allCampaigns() + "/with-email"),
    queryFn: async () => {
      try {
        const smsQuery = query(
          keys.allCampaignsRef(),
          orderByChild("basicInfo/type"),
          equalTo("email")
        );
        const docs = await get(smsQuery);

        return convertFirebaseArrayData<TCampaign>(docs.val());
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <TabsContent value="Email" className="space-y-4">
      {data?.map((item) => {
        return (
          <EmailCampaignListItem
            key={item.id}
            item={item.basicInfo}
            id={item.id}
          />
        );
      })}
    </TabsContent>
  );
};
export default CampaignLayout;
