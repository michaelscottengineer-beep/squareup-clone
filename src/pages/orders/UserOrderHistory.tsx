import { DataTable } from "@/components/ui/data-table";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  endAt,
  equalTo,
  get,
  orderByChild,
  orderByKey,
  push,
  query,
  ref,
  set,
  startAt,
} from "firebase/database";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import { db } from "@/firebase";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronRight, Info, Plus, Search, Star, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

import type { TOrderHistoryDocumentData } from "@/types/order";
import useAuth from "@/hooks/use-auth";
import type { TOrderDocumentData } from "@/types/checkout";
import { formatDate } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TRating } from "@/types/rating";
import { toast } from "sonner";
import imgbbService from "@/services/imggbb.service";
import RatingForm from "./RatingForm";
import Header from "../shop/components/Header";
const UserOrderHistory = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { data: orderIds } = useQuery({
    queryKey: ["users", user?.uid, "orders", "list", "ids"],
    queryFn: async () => {
      try {
        const path = parseSegments("users", user?.uid, "orders");

        const snap = await get(ref(db, path));

        return Object.values(snap.val() ?? {}) as {
          id: string;
          restaurantId: string;
        }[];
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!user?.uid,
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["users", user?.uid, "orders", "list", "ids", orderIds],
    queryFn: async () => {
      try {
        const promise = orderIds?.map(async (order) => {
          const path = parseSegments(
            "restaurants",
            order.restaurantId,
            "allOrders",
            order.id
          );
          const ordersRef = ref(db, path);

          const snap = await get(ordersRef);

          return { ...snap.val(), id: order.id } as TOrderDocumentData;
        });

        return await Promise.all(promise ?? []);
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!orderIds && orderIds.length > 0,
  });
  return (
    <div>
      <div className="shop-container mt-10">
        <h1 className="text-2xl font-medium mb-4">Order History</h1>

        <div className="p-6 space-y-6">
          {orders?.map((order, i) => {
            return <OrderHistoryCard order={order} key={order.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

const OrderHistoryCard = ({ order }: { order: TOrderDocumentData }) => {
  const [isShownRateForm, setIsShownRateForm] = useState(false);
  const [isShownTransaction, setIsShownTransaction] = useState(false);

  return (
    <div key={order.id} className="max-w-[500px]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} onClick={() => setIsShownTransaction(!isShownTransaction)} />
          <div>
            <div className="font-semibold">{order.id}</div>
            <div className="flex items-center gap-1 text-sm">
              <div>{Object.keys(order.cartItems).length} Items</div>
              <Separator className="w-2! h-0.5" />
              <div>
                {formatDate(new Date(order.basicInfo.createdAt), "dd/MM/yyyy")}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsShownRateForm(!isShownRateForm)}
          className={cn(
            "bg-yellow-50 text-yellow-600 hover:bg-yellow-50 hover:shadow-yellow-100 hover:shadow-lg",
            {
              hidden: order.basicInfo.orderStatus !== "accepted",
            }
          )}
        >
          Rate Now <Star className="stroke-yellow-400 fill-yellow-400" />
        </Button>
      </div>

      {isShownRateForm && (
        <RatingForm
          order={order}
          onSubmitCallback={() => setIsShownRateForm(false)}
        />
      )}
    </div>
  );
};

export default UserOrderHistory;
