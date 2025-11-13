"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useAuth from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { parseSegments } from "@/utils/helper";
import type { TRestaurant } from "@/types/restaurant";
import { useNavigate } from "react-router";
import {
  useUserRestaurantIdsQuery,
  useUserRestaurantsQuery,
} from "@/factory/restaurant";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurants", "details", restaurantId],
    queryFn: async () => {
      const resRef = ref(db, parseSegments("restaurants", restaurantId));
      const doc = await get(resRef);

      return doc.val() as TRestaurant;
    },
    enabled: !!restaurantId,
  });

  if (!restaurant) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img
                  alt="restaurant logo"
                  src={
                    restaurant.basicInfo?.logo || "/restaurant_placeholder.png"
                  }
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {restaurant.basicInfo.name}
                </span>
                <span className="truncate text-xs">{"s"}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {user?.role !== "admin" && (
            <DropdownMenuContent
              className={cn(
                "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg",
              
              )}
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Restaurants
              </DropdownMenuLabel>
              <ListRestaurant />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => {
                  navigate("/dashboard/restaurants/new");
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Restaurant
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const ListRestaurant = () => {
  const { user } = useAuth();
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const setRestaurantId = useCurrentRestaurantId((state) => state.set);

  const { data: restaurantIds } = useUserRestaurantIdsQuery(user?.uid);
  const { data: restaurants } = useUserRestaurantsQuery(
    (restaurantIds ?? []).filter((resId) => resId !== restaurantId)
  );

  const handleChange = (id: string) => {
    setRestaurantId(id);
  };

  console.log("teams", restaurants);
  return restaurants?.map((res, index) => (
    <DropdownMenuItem
      key={res.id}
      onClick={() => handleChange(res.id)}
      className="gap-2 p-2"
    >
      <div className="flex size-6 items-center justify-center rounded-md border">
        <img
          alt="restaurant logo"
          src={res.basicInfo.logo || "/restaurant_placeholder.png"}
        />
      </div>
      {res.basicInfo.name}
      {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
    </DropdownMenuItem>
  ));
};
