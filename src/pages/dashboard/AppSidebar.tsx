"use client";
import { BiBorderOuter } from "react-icons/bi";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Briefcase,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
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
import { IoPricetagOutline } from "react-icons/io5";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      isActive: true,
      icon: Home,
      url: "/dashboard",
      items: [],
      canView: ["employee", "admin"],
    },

    {
      title: "Payments & Invoices",
      url: "#",
      icon: BiBorderOuter,
      items: [
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Orders History",
          url: "/dashboard/orders/history",
        },
      ],

      canView: ["employee", "admin"],
    },
    {
      title: "Item & Inventory",
      url: "#",
      icon: IoPricetagOutline,
      items: [
        {
          title: "Item library",
          url: "/dashboard/items/library",
        },
        {
          title: "Categories",
          url: "/dashboard/items/categories",
        },
        {
          title: "Options",
          url: "/dashboard/items/options",
        },
        {
          title: "Modifiers",
          url: "/dashboard/items/modifiers",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
      canView: ["admin"],
    },
    {
      title: "Restaurants",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Management",
          url: "/dashboard/restaurants/management",
        },
        {
          title: "Rating",
          url: "/dashboard/restaurants/rating",
        },
        {
          title: "Settings",
          url: "/dashboard/restaurants/settings",
        },
        {
          title: "Promotions",
          url: "/dashboard/restaurants/promotions",
        },
      ],
      canView: ["admin"],
    },

    {
      title: "Staffs",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "/dashboard/staffs/members",
        },
        {
          title: "Permissions",
          url: "/dashboard/staffs/permissions",
        },
      ],
      canView: ["admin"],
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Management",
          url: "/dashboard/customers/management",
        },
      ],
      canView: ["admin"],
    },
    {
      title: "Jobs",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Management",
          url: "/dashboard/jobs/management",
        },
      ],
      canView: ["admin"],
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
