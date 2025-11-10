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

const RestaurantManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurantIds } = useQuery({
    queryKey: ["restaurants", "of-user", user?.uid, "list-of-id"],
    queryFn: async () => {
      const restaurantsRef = ref(
        db,
        parseSegments("users", user?.uid, "restaurants")
      );

      const doc = await get(restaurantsRef);

      return doc.exists() ? Object.keys(doc.val()) : [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.uid,
  });

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", "of-user", user?.uid, restaurantIds],
    queryFn: async () => {
      const ids = restaurantIds!;

      const promise = ids.map(async (resId) => {
        const resRef = ref(
          db,
          parseSegments("restaurants", resId, "basicInfo")
        );
        return get(resRef);
      });

      return Promise.all(promise).then((data) => {
        return data.map(
          (snapshot, i) =>
            ({
              basicInfo: { ...snapshot.val() },
              id: ids[i],
            } as TRestaurant)
        );
      });
    },
    enabled: !!user?.uid && !!restaurantIds?.length,
  });
console.log('users restaurants', restaurants)
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
