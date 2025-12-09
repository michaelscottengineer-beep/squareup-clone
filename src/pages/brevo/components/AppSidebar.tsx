"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  Box,
  Megaphone,
  Cog,
  Mail,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const menuItems = [
  { title: "Home", icon: Home },
  {
    title: "CRM",
    icon: Users,
    isActive: true,
    subItems: [
      { title: "Contacts", isActive: false, url: "/brevo/contact" },
      { title: "Lists", isActive: false, url: "/brevo/list" },
      { title: "Segments", isActive: false },
    ],
  },
  { title: "Companies", icon: Building2 },
  { title: "Deals", icon: Briefcase },
  { title: "Tasks", icon: CheckSquare },
  { title: "Custom objects", icon: Box, badge: "🎁" },
  {
    title: "Marketing",
    icon: Megaphone,
    subItems: [
      {
        title: "Campaigns",
        url: "/brevo/campaign",
      },
      {
        title: "Mail Templates",
        url: "/brevo/mail-templates",
      },
    ],
  },
  { title: "Automations", icon: Cog },
  { title: "Transactional", icon: Mail },
  { title: "Conversations", icon: MessageSquare },
  { title: "Commerce", icon: ShoppingCart },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <span className="text-2xl font-bold text-[#0b4d2c]">Brevo</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto">{item.badge}</span>
                    )}
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => {
                        const isActive =
                          subItem.url && pathname.endsWith(subItem.url);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                if (subItem.url) navigate(subItem.url);
                              }}
                              className={
                                isActive
                                  ? "bg-[#e8f5e9] text-[#0b4d2c] border-l-4 border-[#4caf50] rounded-none"
                                  : ""
                              }
                            >
                              {subItem.title}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
