import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";

const data = {
  navMain: [
    {
      title: "Cards",
      url: "/billings/cards",
    },
    {
      title: "Transactions",
      url: "/billings/transactions",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
