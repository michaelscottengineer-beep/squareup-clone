"use client";

import { Bell, ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <MenuReceiveOrder />
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="font-semibold"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { type TOrder } from "@/types/checkout";
import { useNavigate } from "react-router";

const MenuReceiveOrder = () => {
  const navigate = useNavigate();

  const socketRef = useRef<Socket>(null);
  const [receivedOrder, setReceivedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL + "/orders");
    socketRef.current.connect();

    socketRef.current?.on("connected", () => {});
    socketRef.current?.on("admin:receive-order", (order) => {
      console.log("received order", order);
      setReceivedOrder(order);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  console.log(receivedOrder);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="font-semibold relative te"
        onClick={() => {
          navigate("/dashboard/notifications");
          setReceivedOrder(null);
        }}
      >
        <div className="text-red-400">
          {receivedOrder ? "Có đơn hàng mới" : ""}
        </div>
        <div className="relative p-1">
          <Bell className="relative  rounded-full"></Bell>
          {receivedOrder && (
            <div className="absolute top-0 right-0 p-2">
              <div className="w-1 h-1 bg-red-400"></div>
              <div className="animate-bellRing bg-red-400  absolute rounded-full  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  "></div>
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
