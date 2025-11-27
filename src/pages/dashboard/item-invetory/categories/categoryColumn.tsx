import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { TItem } from "@/types/item";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, remove } from "firebase/database";
import { toast } from "sonner";
import type { TCategory } from "@/types/category";

export const categoryColumn: ColumnDef<TCategory>[] = [
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <div className="">{row.original.basicInfo.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "categoryParent",
    header: "Parent",
    cell: ({ row }) => (
      <div className="">{row.original.basicInfo.parentId}</div>
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
          const prefix = parseSegments("restaurants", restaurantId);

          const itemRef = ref(
            db,
            parseSegments(prefix, "allGroups", row.original.id)
          );
          await remove(itemRef);
        },
        onSuccess: () => {
          toast.success("deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["allItems"],
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
                navigate("/dashboard/items/categories/" + row.original.id)
              }
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
