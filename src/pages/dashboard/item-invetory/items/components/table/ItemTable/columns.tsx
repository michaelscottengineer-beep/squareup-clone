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

export const columns: ColumnDef<TItem>[] = [
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row, renderValue }) => (
      <div className="flex items-center gap-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <div className="">{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Reporting Category",
    cell: ({ row }) => (
      <div className="">
        {row.original.categories?.map((cate) => cate.basicInfo.name)?.join(",")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Availability",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className="">${row.original.price}</div>,
  },

  {
    id: "actions",
    cell: function Actions({ row }) {
      const payment = row.original;
      const navigate = useNavigate();

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
                navigate("/dashboard/items/library/" + row.original.id)
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
