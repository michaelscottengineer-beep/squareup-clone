import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { TCampaign } from "@/types/brevo";
import { formatDate } from "date-fns";
import { Edit2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

interface EmailCampaignListItemProps {
  item: TCampaign["basicInfo"];
  id: TCampaign["id"];
}

const EmailCampaignListItem = ({ item, id }: EmailCampaignListItemProps) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-row  p-4 items-center gap-8">
      <Checkbox />
      <div className="info flex-1 flex flex-col gap-1">
        <div className="name font-medium">{item.name}</div>
        <div className="date last-edit text-muted-foreground text-sm">
          {formatDate(new Date(item.updatedAt), "yyyy-MM-dd HH:mm")}
        </div>
        <div className="id text-xs text-muted-foreground">{id}</div>
      </div>

      <div className="actions">
        <Button
          onClick={() => {
            navigate("/brevo/email-campaign/edit/" + id);
          }}
          className=""
          variant={"ghost-primary"}
          size={"icon-sm"}
        >
          <Edit2 />
        </Button>
      </div>
    </Card>
  );
};

export default EmailCampaignListItem;
