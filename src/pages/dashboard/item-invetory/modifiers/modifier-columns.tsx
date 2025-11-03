import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import type { TModifier } from "@/types/modifier";
import { parseSegments } from "@/utils/helper";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { ref, remove } from "firebase/database";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const modifierColumns: ColumnDef<TModifier>[] = [
  {
    accessorKey: "basicInfo.displayName",
    header: "Name",
  },
  {
    accessorKey: "kind",
    header: "Type",
    cell: ({ row }) => <div className="">{row.original.basicInfo.kind}</div>,
  },
  {
    accessorKey: "locations",
    header: "Location",
  },
  {
    accessorKey: "list",
    header: "Details",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <div> {row.original.list.map((item) => item.name).join(",")}</div>

        {row.original.list.some((item) => !item.inStock) && (
          <div className="text-red-600 text-xs font-medium">
            Some modifier out of stock
          </div>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      const restaurantId = useCurrentRestaurantId((state) => state.id);

      const mutation = useMutation({
        mutationFn: async () => {
          const segments = parseSegments(
            "restaurants",
            restaurantId,
            "allModifiers",
            row.original.id
          );
          return await remove(ref(db, segments));
        },
        onSuccess: () => {
          toast.success("deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["modifiers"],
          });
        },
        onError: (err) => {
          toast.error("deleted error", {
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
                navigate("/dashboard/items/modifiers/" + row.original.id)
              }
            >
              Apply to Items
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigate("/dashboard/items/modifiers/" + row.original.id)
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
