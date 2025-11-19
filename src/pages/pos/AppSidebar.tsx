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
import { MdTableRestaurant } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { IoPricetagOutline } from "react-icons/io5";
import { SiCoderwall } from "react-icons/si";
import { CiBowlNoodles } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      isActive: true,
      icon: RxDashboard,
      url: "/pos",
      items: [],
      canView: ["employee", "admin"],
    },
 {
      title: "Order Line",
      isActive: true,
      icon: SiCoderwall,
      url: "/pos/order-line",
      items: [],
      canView: ["employee", "admin"],
    },
     {
      title: "Manage Table",
      isActive: true,
      icon: MdTableRestaurant,
      url: "/pos/manage-table",
      items: [],
      canView: ["employee", "admin"],
    },
     {
      title: "Manage Dishes",
      isActive: true,
      icon: CiBowlNoodles,
      url: "/pos/manage-dishes",
      items: [],
      canView: ["employee", "admin"],
    },
     {
      title: "Customers",
      isActive: true,
      icon: Users,
      url: "/pos/customer",
      items: [],
      canView: ["employee", "admin"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon"  {...props} >
   
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain}  />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
