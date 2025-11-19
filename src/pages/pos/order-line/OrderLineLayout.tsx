import React, { useRef } from "react";
import OrderInvoice from "./OrderInvoice";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import { useQuery } from "@tanstack/react-query";
import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
} from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import type { TCategory, TCategoryDocumentData } from "@/types/category";
import usePosOrderLineState from "@/stores/use-pos-order-line-state";
import { LuSoup } from "react-icons/lu";
import { cn } from "@/lib/utils";
import type { TItem } from "@/types/item";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import DashedHr from "@/components/ui/dashed-hr";
import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import type { TOrderDocumentData } from "@/types/checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BsCopy } from "react-icons/bs";
import { toast } from "sonner";

const statusBgColorMap = {
  pending: "bg-[#FFE2DE]",
  "in-kitchen": "bg-[#FFE2DE]",
  ready: "bg-[#E8D4ED]",
};
const statusBadgeColorMap = {
  pending: "bg-[#D7470F]",
  "in-kitchen": "bg-[#0B605A]",
  ready: "bg-[#693290]",
};

const OrderLine = () => {
  const scrollXRef = useRef<HTMLDivElement>(null);
  const setOrderId = usePosOrderLineState((state) => state.setOrderId);
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const { data: orders } = useQuery({
    queryKey: ["restaurants", restaurantId, "allOrders"],
    queryFn: async () => {
      const orderRef = orderFirebaseKey({ restaurantId }).rootRef();

      const orderQuery = query(
        orderRef,
        orderByChild("basicInfo/shippingMethod"),
        equalTo("Dine In")
      );
      const orders = await get(orderQuery);
      return convertFirebaseArrayData<TOrderDocumentData>(orders.val());
    },

    enabled: !!restaurantId,
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold mb-3">Order Line</h1>
      <div className=" overflow-x-auto hidden-scrollbar" ref={scrollXRef}>
        <div className="flex items-center gap-4">
          {orders?.map((o) => {
            return (
              <Card
                key={o.id}
                className={cn(
                  "basis-1/3 shrink-0",
                  statusBgColorMap[
                    o.basicInfo.orderStatus as keyof typeof statusBgColorMap
                  ]
                )}
                onClick={() => {
                  setOrderId(o.id);
                }}
              >
                <CardContent className="space-y-4">
                  <CardHeader className="text-sm p-0 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        Order: {o.id.slice(0, 3) + "..." + o.id.slice(-3)}
                      </CardTitle>
                      <BsCopy
                        onClick={() => {
                          handleCopy(o.id);
                        }}
                      />
                    </div>
                    <span className="font-medium">
                      Table {o.basicInfo.dineIn.tableNumber}
                    </span>
                  </CardHeader>

                  <strong>Item: {Object.keys(o.cartItems).length}X</strong>

                  <div className="flex items-center mt-2 justify-between">
                    <span className="text-sm font-semibold">
                      {formatDistanceToNow(new Date(o.basicInfo.createdAt))}
                    </span>
                    <span
                      className={cn(
                        "text-white text-xs rounded-full px-2 py-0.5 capitalize",
                        statusBadgeColorMap[
                          o.basicInfo
                            .orderStatus as keyof typeof statusBadgeColorMap
                        ]
                      )}
                    >
                      {o.basicInfo.orderStatus}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OrderLineLayout = () => {
  return (
    <div className="gap-8 grid grid-cols-6 bg-gray-50 ">
      <div className="order-main col-span-4 bg-white px-8 py-8">
        <OrderLine />
        <CategoryList />
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </div>
      <OrderInvoice />
    </div>
  );
};

const CategoryList = () => {
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const setCategoryId = usePosOrderLineState(
    (state) => state.setCurrentCategoryId
  );

  const { data: categories } = useQuery({
    queryKey: ["restaurants", restaurantId, "allGroups"],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups")
      );

      const categories = await get(categoriesRef);
      return convertFirebaseArrayData<TCategory>(categories.val());
    },
    select: (data) => {
      if (data.length) {
        setCategoryId(data[0].id);
      }
      return data;
    },
    enabled: !!restaurantId,
  });

  if (!categories) return "no";
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl mb-8">Food Categories</h1>
        <ButtonGroup>
          <Button
            className="bg-transparent hover:bg-transparent text-primary"
            onClick={() => {
              categoriesScrollRef.current?.scrollBy({
                behavior: "smooth",
                left: -200,
                top: 0,
              });
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            className="bg-transparent hover:bg-transparent text-primary"
            onClick={() => {
              categoriesScrollRef.current?.scrollBy({
                behavior: "smooth",
                left: 200,
                top: 0,
              });
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      </div>
      <div
        className=" overflow-x-auto hidden-scrollbar"
        ref={categoriesScrollRef}
      >
        <div className="flex items-center gap-4 w-max">
          {[...categories, ...categories, ...categories]?.map((cate) => {
            return <CategoryListItem category={cate} />;
          })}
        </div>
      </div>

      <DashedHr className="my-8" />

      <CategoryItemList />
    </div>
  );
};

interface CategoryListItemProps {
  category: TCategory;
  onValueChange?: (category: TCategory) => void;
}

const CategoryListItem = ({ category }: CategoryListItemProps) => {
  const curId = usePosOrderLineState((state) => state.currentCategoryId);
  const setCategoryId = usePosOrderLineState(
    (state) => state.setCurrentCategoryId
  );

  console.log(category.items);
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border-2 cursor-pointer",
        {
          " border-primary": category.id === curId,
          " border-gray-200 ": category.id !== curId,
        }
      )}
      onClick={() => setCategoryId(category.id)}
    >
      <div className="bg-gray-100 rounded-md p-2 h-full aspect-square">
        <LuSoup />
      </div>
      <div className="flex  flex-col">
        <span className="font-medium text-sm">{category.basicInfo.name}</span>
        <span className="text-gray-500 text-xs">
          {Object.keys(category.items).length} Items
        </span>
      </div>
    </div>
  );
};

const CategoryItemList = () => {
  const restaurantId = useCurrentRestaurantId((state) => state.id);
  const curId = usePosOrderLineState((state) => state.currentCategoryId);

  const { data: category } = useQuery({
    queryKey: ["restaurants", restaurantId, "allGroups", curId],
    queryFn: async () => {
      const categoriesRef = ref(
        db,
        parseSegments("/restaurants/", restaurantId, "/allGroups", curId)
      );

      const categories = await get(categoriesRef);
      return categories.val() as TCategoryDocumentData;
    },

    enabled: !!restaurantId && !!curId,
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {convertFirebaseArrayData<TItem>(category?.items ?? {})?.map((item) => {
        return <CategoryItem key={item.id} item={item} />;
      })}
    </div>
  );
};

const CategoryItem = ({ item }: { item: TItem }) => {
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const addItem = usePosOrderLineState((state) => state.add);
  const removeItem = usePosOrderLineState((state) => state.remove);

  const handleAdd = () => {
    addItem({
      ...item,
      amount: 1,
      note: "",
    });
  };

  const handleRemove = () => {
    removeItem({
      ...item,
      amount: 1,
      note: "",
    });
  };

  const count = selectedItems?.[item.id]?.amount || 0;

  return (
    <div
      key={item.id}
      className={cn("rounded-md border-2 border-border", {
        "border-primary": count,
      })}
    >
      <div
        className={cn("p-0.5 rounded-xs", {
          "p-1": !!count,
        })}
      >
        <div className="bg-gray-100/80 rounded-md flex items-center justify-center py-4">
          <img src={item.image} className=" w-1/3 rounded-md aspect-square" />
        </div>
      </div>
      <div className="p-2 flex flex-col gap-4">
        <div className="font-medium text-sm capitalize">{item.name}</div>

        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">
            ${Number(item.price).toFixed(2)}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={"secondary"}
              className="rounded-full p-1! h-max w-max bg-gray-100 text-gray-700 hover:text-gray-100"
              onClick={handleRemove}
              disabled={count === 0}
            >
              <Minus className="w-3! h-3!" />
            </Button>
            <div className="font-medium text-xs">{count}</div>
            <Button
              className="rounded-full p-1! h-max w-max"
              onClick={handleAdd}
            >
              <Plus className="w-3! h-3!" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderLineLayout;
