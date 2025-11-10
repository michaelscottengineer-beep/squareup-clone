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
import { MoreHorizontal, Star } from "lucide-react";
import { useNavigate } from "react-router";

import { db } from "@/firebase";
import { getConcatAddress, parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, remove } from "firebase/database";
import { toast } from "sonner";
import type { TRestaurant } from "@/types/restaurant";
import useAuth from "@/hooks/use-auth";

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
    header: "Item",
    cell: ({ row, renderValue }) => (
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
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const queryClient = useQueryClient();
      const { user } = useAuth();

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
      );
    },
  },
];
