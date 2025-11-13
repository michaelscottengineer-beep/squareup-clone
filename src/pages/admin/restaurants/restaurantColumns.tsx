import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { TItem } from "@/types/item";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Star, User } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { db } from "@/firebase";
import { getConcatAddress, parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, remove, set, update } from "firebase/database";
import { toast } from "sonner";
import type { TRestaurant } from "@/types/restaurant";
import useAuth from "@/hooks/use-auth";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import restaurantQueyKeys from "@/factory/restaurant/restaurant.queries";
import RestaurantStatistic from "./RestaurantStatistic";
import { useState } from "react";

export const restaurantColumns: ColumnDef<TRestaurant>[] = [
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div className="">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <div className="">{row.original.basicInfo.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "rate",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span>{row.original.basicInfo?.ratingInfo?.rate}</span>
        <span>{`(+${row.original.basicInfo?.ratingInfo?.count} ratings)`}</span>
        <Star className="fill-yellow-300 size-4 text-yellow-300" />
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const { street1, street2, state, city, zip } =
        row.original.basicInfo.addressInfo;

      return (
        <div className="">
          {getConcatAddress(street1 || street2, city, state, zip)}
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Created By",
    cell: ({ row }) => {
      const { avatar, restaurants, displayName } =
        row.original.basicInfo.createdByObj;

      return (
        <div className="flex items-center gap-1">
          {avatar ? <img alt="user-avt" src={avatar} /> : <User size={18} />}
          <div className="flex flex-col gap-1">
            <span className="font-semibold">{displayName}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const queryClient = useQueryClient();
      const { user } = useAuth();
      const [isOpenStatistic, setIsOpenStatistic] = useState(false);

      const mutation = useMutation({
        mutationFn: async () => {
          const restaurantId = row.original.id;
          const restaurantRef = ref(
            db,
            parseSegments("restaurants", restaurantId)
          );

          const useRestaurantRef = ref(
            db,
            parseSegments("users", user?.uid, "restaurants", restaurantId)
          );

          return await Promise.all([
            remove(useRestaurantRef),
            remove(restaurantRef),
          ]);
        },
        onSuccess: () => {
          toast.success("deleted restaurant successfully");
          queryClient.invalidateQueries({
            queryKey: ["restaurants", "of-user", user?.uid, "list-of-id"],
          });
        },
        onError: (err) => {
          console.error("delete restaurant occur an error");
          toast.error("deleted restaurant error", {
            description: err.message,
          });
        },
      });

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => setIsOpenStatistic(true)}>
                View Statistics
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={"/shop/" + row.original.id} target="_blank">
                  View website
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to={"/dashboard/orders"}
                  target="_blank"
                  onClick={() => {
                    useCurrentRestaurantId.getState().set(row.original.id);
                  }}
                >
                  Use As Owner
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate("/dashboard/restaurants/" + row.original.id)
                }
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => mutation.mutate()}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RestaurantStatistic
            isOpen={isOpenStatistic}
            setIsOpen={setIsOpenStatistic}
            restaurantId={row.original.id}
          />
        </>
      );
    },
  },
];
