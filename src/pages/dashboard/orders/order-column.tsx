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
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, remove } from "firebase/database";
import { toast } from "sonner";
import type { TOrder } from "@/types/checkout";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
export const orderColumns: ColumnDef<TOrder>[] = [
  {
    accessorKey: "name",
    header: "Order",
    cell: ({ row, renderValue }) => (
      <div className="flex items-center gap-1">
        {/* <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        /> */}
        <div className="">{row.original.id}</div>
      </div>
    ),
  },
  {
    accessorKey: "basicInfo.createdAat",
    header: "Date",
    cell: ({ row }) => (
      <div className="">
        {formatDate(
          new Date(row.original.basicInfo.createdAt),
          "dd/MM/yyyy HH:ss"
        )}
      </div>
    ),
  },
  {
    accessorKey: "basicInfo.status",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.basicInfo.status;

      return (
        <div
          className={cn(" font-semibold w-max rounded-md px-2 ", {
            "bg-yellow-50 text-yellow-500": status === "pending",
            "bg-green-50 text-green-500": status === "success",
          })}
        >
          {row.original.basicInfo.status}
        </div>
      );
    },
  },
  {
    accessorKey: "basicInfo.feeSummary.total",
    header: "Total",
    cell: ({ row }) => (
      <div className="">
        ${row.original.basicInfo.feeSummary.total.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "cartItems",
    header: "Items",
    cell: ({ row }) => (
      <div className="">{row.original.cartItems.length} Items</div>
    ),
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      const restaurantId = useCurrentRestaurantId((state) => state.id);

      const mutation = useMutation({
        mutationFn: async () => {},
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate("/dashboard/orders/" + row.original.id)}
            >
              View
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
