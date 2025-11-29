import { type ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import type { TMember } from "@/types/staff";
import ActionsCell from "./components/ActionsCell";
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
              "bg-red-100 text-red-500": status === "rejected",
              "bg-gray-100 text-gray-500": status === "canceled",
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
      return <ActionsCell member={row.original} />;
    },
  },
];
