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
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { push, ref, remove, set, update } from "firebase/database";
import { toast } from "sonner";
import type {
  TOrder,
  TOrderCartItem,
  TOrderDocumentData,
} from "@/types/checkout";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import type { TOrderHistory } from "@/types/order";
import useAuth from "@/hooks/use-auth";
import type { TPaymentIntentListItem } from "@/types/transaction";
import { GoDotFill } from "react-icons/go";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import OrderItemSection from "./OrderItemsSection";
import OrderDetailSheet from "./OrderDetailSheet";

export const transactionColumns: ColumnDef<TPaymentIntentListItem>[] = [
  {
    accessorKey: "transaction-number",
    header: "TRANSACTION NUMBER",
    cell: ({ row, renderValue }) => {
      const { id } = row.original;
      return <div>{id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "PAYMENT METHOD",
    cell: ({ row, renderValue }) => {
      const { type, card } = row.original.userPaymentMethod;
      return (
        <div className="flex gap-1 flex-col">
          <div className="">{type === "card" ? "Credit Card" : ""}</div>
          <div className="flex items-center gap-1 text-gray-400 font-medium">
            <div className="flex items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <GoDotFill key={i + 1} size={5} />
              ))}
            </div>
            <div className="text-xs">{card.last4}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <div
        className={cn(
          "rounded-full text-center font-medium h-max w-max px-2 py-1",
          {
            "bg-green-100 text-green-400": row.original.status === "succeeded",
          }
        )}
      >
        {row.original.status === "succeeded" ? "Success" : row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ row }) => {
      const { amount, currency } = row.original;

      return (
        <div className="bg-red-50 text-red-400 font-medium rounded-full h-max w-max px-2 py-1 text-center justify-center flex items-center gap-1">
          <span>-</span> <span>{amount.toFixed(2)}</span>{" "}
          <span className="uppercase">{currency}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ row }) => {
      const { created } = row.original;
      return (
        <div className="">
          {formatDate(new Date(created * 1000), "dd/MM/yyyy HH:ss")}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "",
    cell: function Actions({ row }) {
      const navigate = useNavigate();
      const {
        id,
        metadata: { orderId, shopId },
      } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <OrderDetailSheet orderId={orderId} restaurantId={shopId} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
