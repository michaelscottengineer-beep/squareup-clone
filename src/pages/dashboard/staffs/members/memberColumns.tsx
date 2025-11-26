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

import { db } from "@/firebase";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ref, remove } from "firebase/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/use-auth";
import type { TMember } from "@/types/staff";
export const memberColumns: ColumnDef<TMember>[] = [
  {
    accessorKey: "id",
    header: "StaffId",
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
    accessorKey: "basicInfo.fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="">{row.original.basicInfo.fullName}</div>
    ),
  },
  {
    accessorKey: "basicInfo.address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.basicInfo.address;

      return <div>{address}</div>;
    },
  },
  {
    accessorKey: "basicInfo.job",
    header: "Job",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.basicInfo.job}</div>
    ),
  },
  {
    accessorKey: "basicInfo.email",
    header: "Email",
    cell: ({ row }) => <div className="">{row.original.basicInfo.email}</div>,
  },
  {
    accessorKey: "basicInfo.gender",
    header: "Gender",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.basicInfo.gender}</div>;
    },
  },
  {
    accessorKey: "basicInfo.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.basicInfo.status;
      return (
        <div
          className={cn(
            "capitalize font-medium w-max px-2 py-1 rounded-full text-xs",
            {
              "bg-green-100 text-green-500": status === "accepted",
              "bg-yellow-100 text-yellow-500": status === "pending",
            }
          )}
        >
          {status}
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
      const { id: staffId, basicInfo } = row.original;

      const restaurantId = useCurrentRestaurantId((state) => state.id);

      const { mutate: handleDelete } = useMutation({
        mutationFn: async () => {
          const staffPath = parseSegments(
            "restaurants",
            restaurantId,
            "allStaffs",
            staffId
          );
          const staffRestaurantPath = parseSegments(
            "users",
            basicInfo.userUID,
            "restaurants",
            restaurantId
          );

          return await Promise.all([
            remove(ref(db, staffPath)),
            remove(ref(db, staffRestaurantPath)),
          ]);
        },
        onSuccess: () => {
          toast.success("deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["restaurants", restaurantId, "allStaffs"],
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
            <DropdownMenuItem onClick={() => handleDelete()}>
              Delete
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigate("/dashboard/staffs/members/" + row.original.id)
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
