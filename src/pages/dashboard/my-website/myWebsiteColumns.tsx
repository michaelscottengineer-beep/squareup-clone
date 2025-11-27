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
import { MoreHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router";

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { push, ref, remove, set, update } from "firebase/database";
import { toast } from "sonner";
import type { TOrder } from "@/types/checkout";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import type { TOrderHistory } from "@/types/order";
import useAuth from "@/hooks/use-auth";
import type { TWebsite, TWebsiteTemplate } from "@/types/website-template";

import templateFirebaseKey from "@/factory/template/template.firebaseKey";
export const myWebsiteColumns: ColumnDef<TWebsite>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row, renderValue }) => (
      <div className="flex items-center gap-1">
        <div className="">{row.original.id}</div>
      </div>
    ),
  },
  {
    accessorKey: "basicInfo.createdBy",
    header: "Created By",
    cell: ({ row }) => (
      <div className="">{row.original.basicInfo.createdBy}</div>
    ),
  },
  {
    accessorKey: "basicInfo.name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.basicInfo.name;

      return <div>{name}</div>;
    },
  },
  {
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();

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
              onClick={() => {
                navigate("/websites/" + row.original.id + "/editor", {
                });
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/websites/" + row.original.id + "");
              }}
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
