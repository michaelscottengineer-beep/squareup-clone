import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "firebase/database";
import { toast } from "sonner";
import JobActionDialog from "./PermissionActionDialog";
import restaurantFirebaseKey from "@/factory/restaurant/restaurant.firebasekey";
import type { TPermission } from "@/types/permission";
export const permissionColumns: ColumnDef<TPermission>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => <div className="">{row.original.id}</div>,
  },
  {
    accessorKey: "basicInfo.name",
    header: "Name",
    cell: ({ row }) => <div className="">{row.original.basicInfo.name}</div>,
  },
  {
    accessorKey: "basicInfo.shortName",
    header: "Short Name",
    cell: ({ row }) => (
      <div className="">{row.original.basicInfo.shortName}</div>
    ),
  },
  {
    accessorKey: "basicInfo.description",
    header: "Description",
    cell: ({ row }) => (
      <div className="">{row.original.basicInfo.description}</div>
    ),
  },

  {
    id: "actions",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      const restaurantId = useCurrentRestaurantId((state) => state.id);

      const { mutate: deleteJob } = useMutation({
        mutationFn: async () => {
          const jobRef = restaurantFirebaseKey({
            restaurantId,
            jobKey: row.original.id,
          }).jobRef();

          return await remove(jobRef);
        },
        onSuccess: () => {
          toast.success("deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["restaurants", restaurantId, "allJobs"],
          });
        },
        onError: (err) => {
          console.error("delete err", err);
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

            <JobActionDialog
              permissionKey={row.original.id}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              }
            />

            <DropdownMenuItem onClick={() => deleteJob()}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
