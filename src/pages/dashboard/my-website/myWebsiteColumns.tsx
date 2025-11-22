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
import type { TWebsiteTemplate } from "@/types/website-template";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import templateFirebaseKey from "@/factory/template/template.firebaseKey";
export const myWebsiteColumns: ColumnDef<TWebsiteTemplate>[] = [
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
    header: "Date",
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
      const queryClient = useQueryClient();
      const { user } = useAuth();

      const restaurantId = useCurrentRestaurantId((state) => state.id);

      const mutation = useMutation({
        mutationFn: async () => {
          const keys = templateFirebaseKey({ restaurantId });

          const templateRef = keys.restaurantRootRef();

          return await push(templateRef, {
            ...row.original,
            basicInfo: {
              ...row.original.basicInfo,
              createdBy: user?.uid,
            },
          });
        },
        onSuccess: () => {
          toast.success("Create with this template success!");
        },
        onError: (err) => { 
          console.error(err)
          toast.error('Create template error: ' + err.message)
        }
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
              onClick={() => {
                navigate('/web-builder/templates/' + row.original.id + '/editor')
              }}
            >
              Edit
            </DropdownMenuItem>
      
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
