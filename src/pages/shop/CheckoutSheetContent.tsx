import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import useCart from "@/stores/use-cart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "react-router";
import AddPaymentMethodButton from "./AddPaymentMethodButton";
import DineInTabsContent from "./DineInTabsContent";
import DeliveryTabsContent from "./DeliveryTabsContent";
import { useForm } from "react-hook-form";
import { type TCheckoutFormDataValues, type TOrder } from "@/types/checkout";
import { Form } from "@/components/ui/form";
import PickUpTabsContent from "./PickUpTabsContent";
import { parseSegments } from "@/utils/helper";
import useAuth from "@/hooks/use-auth";
import { increment, push, ref, set, update } from "firebase/database";
import { db } from "@/firebase";
import GratuitySelector from "./GratuitySelector";
import CostFreeSummary from "./CostFreeSummary";
import ListCard from "./ListCard";
import { io, Socket } from "socket.io-client";
import checkoutService from "@/services/checkout.service";
import useCheckAvailableOpeningHours from "@/hooks/use-check-available-opening-hours";

const data = [
  { icon: MdOutlineTableRestaurant, label: "Dine In" },
  { icon: PiHandWavingBold, label: "Pickup" },
  { icon: IoCarSportOutline, label: "Delivery" },
];

const CheckoutSheetContent = () => {
  const { user } = useAuth();
  const { shopId } = useParams(); // Destructure to get the 'slug' parameter
  const socketRef = useRef<Socket | null>(null);
  const isAvailableOpeningHours = useCheckAvailableOpeningHours(shopId);

  const items = useCart((state) => state.items);
  const form = useForm<TCheckoutFormDataValues & { shippingMethod?: string }>({
    defaultValues: {
      delivery: {
        deliveryInfo: {
          restaurantAddress: "75 5th Street NW, Atlanta, GA 30308",
        },
      },
      shippingMethod: "Dine In",
      gratuity: "10%",
      feeSummary: {
        tax: 0.45,
        serviceFee: 0.5,
        paymentProcessingFee: 0.18,
        subTotal: 0,
        tip: 0,
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (orderInfo: Partial<TCheckoutFormDataValues>) => {
      console.log(items);
      let prefixSegment = parseSegments("restaurants", shopId, "allOrders");
      const newOrderRef = push(ref(db, prefixSegment));
      prefixSegment = parseSegments(prefixSegment, newOrderRef.key);

      if (!newOrderRef.key || !shopId)
        return Promise.reject("missing value shopId or orderId");

      const updates: { [key: string]: any } = {};

      const userTrackingOrderPath = parseSegments(
        "users",
        user?.uid,
        "orders",
        newOrderRef.key
      );
      const userTrackingOrderData = {
        id: newOrderRef.key,
        restaurantId: shopId,
      };
      updates[userTrackingOrderPath] = userTrackingOrderData;

      const restaurantCustomerPath = {
        index: () =>
          parseSegments("restaurants", shopId, "allCustomers", user?.uid),
        order: () =>
          parseSegments(
            restaurantCustomerPath.index(),
            "orders",
            newOrderRef.key
          ),
        statistics: {
          index: () =>
            parseSegments(restaurantCustomerPath.index(), "statistics"),
          totalOrder: () =>
            parseSegments(
              restaurantCustomerPath.statistics.index(),
              "totalOrder"
            ),
        },
      };

      updates[restaurantCustomerPath.order()] = { id: newOrderRef.key, createdAt: new Date().toISOString() };
      updates[restaurantCustomerPath.statistics.totalOrder()] = increment(1);
      console.log(updates)

      await update(ref(db), updates);
      const basicInfoRef = ref(db, parseSegments(prefixSegment, "basicInfo"));

      const promise1 = items.map(async (item) => {
        const orderItemRef = ref(
          db,
          parseSegments(prefixSegment, "cartItems", item.id)
        );
        const selectedModifier = item.modifiers?.[0]?.list?.[0];

        return await set(orderItemRef, {
          price: item.price,
          image: item.image,
          name: item.name,
          quantity: item.amount,
          modifier: selectedModifier
            ? {
                name: selectedModifier.name,
                price: selectedModifier.price,
              }
            : {},
        });
      });

      console.log("basic info", {
        ...orderInfo,
        status: "pending",
        orderStatus: "pending",
        createdBy: user?.uid,
        createdAt: new Date().toISOString(),
      });
      const promise2 = [
        await set(basicInfoRef, {
          ...orderInfo,
          status: "pending",
          orderStatus: "pending",
          createdBy: user?.uid,
          restaurantId: shopId,
          createdAt: new Date().toISOString(),
        } as TOrder["basicInfo"]),
      ];

      const paymentInfoRef = ref(
        db,
        parseSegments(prefixSegment, "paymentInfo")
      );
      await set(paymentInfoRef, {
        ...orderInfo.paymentInfo,
      });

      const notificationsRef = ref(
        db,
        parseSegments("restaurants", shopId, "allNotifications")
      );

      await push(notificationsRef, {
        type: "order",
        urlItem: "/dashboard/orders/" + newOrderRef.key,
        title: "New order is placed",
        content: "",
        items,
        createdAt: new Date().toISOString(),
      });

      const line_items = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Number(item.price) * 100, // Amount in cents
        },
        quantity: item.amount,
      }));

      socketRef.current?.emit("order:user-create", {
        ...orderInfo,
        id: newOrderRef.key,
      });

      return await checkoutService.createCheckoutSession({
        line_items,
        orderId: newOrderRef.key,
        shopId,
      });
    },
    onSuccess: (data) => {
      toast.success("success create session checkout");
      window.location.href = data.url;
    },
    onError: (err) => {
      console.error("create chekcout session error", err);
      toast.error("create chekcout session error", {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL + "/orders");
    socketRef.current.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const onSubmit = (
    data: TCheckoutFormDataValues & { shippingMethod?: string }
  ) => {
    if (!isAvailableOpeningHours) {
      toast.error("Shop have not opened yet! Please place an order later");
      return;
    }
    if (!data?.paymentInfo?.methodId) {
      toast.error("Please choose the payment method");
      return;
    }

    console.log("data submit", data);
    const obj = { ...data };
    if (data.shippingMethod === "Dine In") {
      delete (obj as any)["delivery"];
      delete (obj as any)["pickup"];
    } else if (data.shippingMethod === "Delivery") {
      delete (obj as any)["dineIn"];
      delete (obj as any)["pickup"];
      console.log(123);
    } else if (data.shippingMethod === "Pickup") {
      delete (obj as any)["dineIn"];
      delete (obj as any)["delivery"];
    }

    console.log("new data submit with ojb", obj);
    mutation.mutate(obj);
  };

  return (
    <Form {...form}>
      <form
        className="px-4 py-4 space-y-6 overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Tabs
          defaultValue="Dine In"
          onValueChange={(tab) => form.setValue("shippingMethod", tab)}
        >
          <TabsList className="w-full">
            {data.map((item) => {
              return (
                <TabsTrigger key={item.label} value={item.label}>
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="Dine In">
            <DineInTabsContent form={form} />
          </TabsContent>
          <TabsContent value="Pickup">
            <PickUpTabsContent form={form} />
          </TabsContent>

          <TabsContent value="Delivery">
            <DeliveryTabsContent form={form} />
          </TabsContent>
        </Tabs>

        <GratuitySelector onChange={(val) => form.setValue("gratuity", val)} />

        <CostFreeSummary form={form} />

        <ListCard
          onChange={(methodId) =>
            form.setValue("paymentInfo.methodId", methodId)
          }
        />
        <AddPaymentMethodButton />
        <Button className="w-full">Done</Button>
      </form>
    </Form>
  );
};

export default CheckoutSheetContent;
