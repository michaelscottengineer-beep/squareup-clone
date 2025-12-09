import { Button } from "@/components/ui/button";
import { useRestaurantFirebaseKey } from "@/factory/restaurant/restaurant.firebasekey";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TCampaign } from "@/types/brevo";
import { useQueryClient } from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

const MessageConfiguration = ({
  initialConfig,
  onValueChange,
}: {
  initialConfig: TCampaign["config"];
  onValueChange?: (value: string) => void;
}) => {
  const { campaignId } = useParams();
  const queryClient = useQueryClient();

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const keys = useRestaurantFirebaseKey({ restaurantId, campaignId });

  const navigate = useNavigate();

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  return (
    <Card className="p-4 h-full min-h-svh">
      <CardHeader className="p-0">
        <Item className="p-0">
          <ItemMedia>
            <CheckCircle2
              className={cn(config?.message && "fill-green-700 text-white")}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <h2 className="text-lg">Message Content</h2>
            </ItemTitle>
            <ItemDescription>{config?.mms.src ? 1 : 0} MMS</ItemDescription>
          </ItemContent>

          <ItemActions>
            <Button
              className="rounded-full"
              variant={"outline"}
              onClick={() =>
                navigate("/brevo/sms-campaign/design/" + campaignId)
              }
            >
              Edit
            </Button>
          </ItemActions>
        </Item>
      </CardHeader>

      <CardContent className="bg-muted/60 p-0 h-full flex flex-col justify-center px-4">
        {config?.mms.src && (
          <img
            className=" max-w-xs rounded-lg mb-2"
            src={config?.mms.src ?? ""}
            alt="preview-mms"
          />
        )}
        <Input
          value={config?.message.text}
          className="bg-white outline-none  border-none rounded-full"
          disabled
        />
      </CardContent>
    </Card>
  );
};

export default MessageConfiguration;
