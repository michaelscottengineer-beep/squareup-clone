"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Search } from "lucide-react";

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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { restaurantColumns } from "./restaurantColumns";
import {
  useUserRestaurantIdsQuery,
  useUserRestaurantsQuery,
} from "@/factory/restaurant";

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurantIds } = useUserRestaurantIdsQuery(user?.uid);

  const { data: restaurants } = useUserRestaurantsQuery(restaurantIds ?? []);

  return (
    <div className="px-2">
      <div className="flex justify-between mb-3 items-center">
        <div className="flex gap-4 max-w-[300px]">
          <InputGroup>
            <InputGroupInput placeholder="Search..." className="rounded-full" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex items-center gap-2">
          {/* <QuickCreationDialog /> */}
          <Button
            className="rounded-full px-5 py-3"
            onClick={() => navigate("/dashboard/restaurants/new")}
          >
            Create new
          </Button>
        </div>
      </div>

      {!restaurants?.length ? (
        <div>No items</div>
      ) : (
        <DataTable columns={restaurantColumns} data={restaurants} />
      )}
    </div>
  );
};

export default RestaurantManagement;
