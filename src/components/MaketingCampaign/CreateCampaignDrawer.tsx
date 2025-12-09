import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronDown, Mail } from "lucide-react";
import { SiMacpaw } from "react-icons/si";
import { useNavigate } from "react-router";

const items = [
  {
    type: "email",
    icon: Mail,
    label: "Email",
    bgColor: "bg-blue-50",
    url: "/brevo/email-campaign/campaign-setup",
  },
  {
    type: "sms",
    icon: SiMacpaw,
    label: "SMS",
    bgColor: "bg-purple-50",
    url: "/brevo/sms-campaign/campaign-setup",
  },
];

const CreateCampaignDrawer = () => {
  const navigate = useNavigate();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"secondary"} size={"sm"}>
          Create campaign
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a campaign</DrawerTitle>
        </DrawerHeader>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-medium">Standard</h3>
            <span className="text-sm text-muted-foreground">
              Create a one-off campaign from scratch.
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {items.map((item) => {
              return (
                <div
                  key={item.type}
                  className="border flex flex-col rounded-md border-border basis-1/4 cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  <div
                    className={cn(
                      item.bgColor,
                      "flex-1 justify-center flex items-center p-5"
                    )}
                  >
                    <item.icon size={50} />
                  </div>
                  <p className="text-center font-medium p-2">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateCampaignDrawer;
