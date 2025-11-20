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
  Plus,
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
import { IoPricetagOutline } from "react-icons/io5";
import { MdOutlinePointOfSale } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdditionElementPopover from "./components/AdditionElementPopover";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Add Elements",
      isActive: true,
      icon: Plus,
      url: "/dashboard",
      popover: AdditionElementPopover,  
    },
  ],
};

export default function WebBuilderEditorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
