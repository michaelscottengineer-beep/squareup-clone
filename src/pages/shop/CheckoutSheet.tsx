import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RiShoppingCartLine } from "react-icons/ri";
import useCart from "@/stores/use-cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeftFromLine, ArrowLeftIcon, Plus, X } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { TCartItem } from "@/types/item";
import CreationCartItemDialog from "./CreationCartItemDialog";
import ShippingMethodSelector from "./ShippingMethodSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { PiHandWavingBold } from "react-icons/pi";
import { IoCarSportOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentMethodButton from "./AddPaymentMethodButton";
import DineInTabsContent from "./DineInTabsContent";
import DeliveryTabsContent from "./DeliveryTabsContent";
import { useForm } from "react-hook-form";
import { type TCheckoutFormDataValues } from "@/types/checkout";
import { Form } from "@/components/ui/form";
import PickUpTabsContent from "./PickUpTabsContent";
import { parseSegments } from "@/utils/helper";
import useAuth from "@/hooks/use-auth";
import { push, ref, set } from "firebase/database";
import { db } from "@/firebase";
import GratuitySelector from "./GratuitySelector";
import CostFreeSummary from "./CostFreeSummary";
import ListCard from "./ListCard";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";

const data = [
  { icon: MdOutlineTableRestaurant, label: "Dine In" },
  { icon: PiHandWavingBold, label: "Pickup" },
  { icon: IoCarSportOutline, label: "Delivery" },
];

const CheckoutSheet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
      const { shopId } = useParams(); // Destructure to get the 'slug' parameter

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

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      const selectedModifier = item.modifiers?.[0]?.list?.[0];

      const total = Number(item.price) * item.amount;
      const totalWithModifiers =
        total +
        (selectedModifier ? Number(selectedModifier.price) * item.amount : 0);
      const totalWithPromotion =
        totalWithModifiers - (totalWithModifiers * 20) / 100;

      return acc + totalWithPromotion;
    }, 0);
  }, [items]);

  const mutation = useMutation({
    mutationFn: async (orderInfo: Partial<TCheckoutFormDataValues>) => {
      console.log(items);
      let prefixSegment = parseSegments("restaurants", shopId, "allOrders", user?.uid);
      const newOrderRef = push(ref(db, prefixSegment));
      prefixSegment = parseSegments(prefixSegment, newOrderRef.key);

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

      const promise2 = [
        await set(basicInfoRef, { ...orderInfo, status: "pending", createdAt: new Date().toISOString() }),
      ];

      const paymentInfoRef = ref(
        db,
        parseSegments(prefixSegment, "paymentInfo")
      );
      await set(paymentInfoRef, {
        ...orderInfo.paymentInfo,
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

      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            line_items,
            orderId: newOrderRef.key,
            shopId
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return await res.json();
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

  const onSubmit = (
    data: TCheckoutFormDataValues & { shippingMethod?: string }
  ) => {
    if (!data?.paymentInfo?.methodId) {
      toast.error('Please choose the payment method');
      return;
    };
    
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
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <div>
            <span>Checkout</span> <span>${total.toFixed(2)}</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false} className="">
        <SheetHeader className="flex items-center flex-row border border-border">
          <SheetClose className="bg-muted p-1 rounded-md hover:shadow-sm  h-max w-max">
            <ArrowLeftIcon className="w-5 h-5" />
          </SheetClose>
          <SheetTitle className="text-center flex-1 text-xl font-semibold">
            Express Check Out
          </SheetTitle>
        </SheetHeader>

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

            <GratuitySelector
              onChange={(val) => form.setValue("gratuity", val)}
            />

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
      </SheetContent>
    </Sheet>
  );
};

export default CheckoutSheet;
