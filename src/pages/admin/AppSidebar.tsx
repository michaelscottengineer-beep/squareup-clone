"use client";
import { BiBorderOuter } from "react-icons/bi";

import * as React from "react";
import {
  Bot,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./TeamSwitcher";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      isActive: true,
      icon: Home,
      url: "/admin",
      items: [],
    },
    {
      title: "Restaurants",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Management",
          url: "/admin/restaurants/management",
        },
      ],
    },
  

  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
