import React, { useEffect } from "react";
import {
  CheckCircle2,
  Package,
  Mail,
  ArrowRight,
  Download,
  Home,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import useAuth from "@/hooks/use-auth";
import { get, ref, set } from "firebase/database";
import { db } from "@/firebase";
import { convertFirebaseArrayData, parseSegments } from "@/utils/helper";
import {
  type TOrderCartItem,
  type TOrderDocumentData,
} from "@/types/checkout";
import { Skeleton } from "@/components/ui/skeleton";
import useCart from "@/stores/use-cart";

export default function SuccessPay() {
  const [search] = useSearchParams();

  const { user } = useAuth();
  const orderId = search.get("orderId");
  const shopId = search.get("shopId");

  const { data: order, isLoading } = useQuery({
    queryKey: ["restaurants", shopId, "orders", orderId],
    queryFn: async () => {
      const orderInfoRef = ref(db, parseSegments("restaurants", shopId, "allOrders", orderId));
      const doc = await get(orderInfoRef);
      return { ...doc.val(), id: orderId } as TOrderDocumentData;
    },
    enabled: !!orderId && !!user?.uid && !!shopId,
  });

  const {mutate: updateStatus} = useMutation({
    mutationFn: async (order: TOrderDocumentData) => {
     const orderInfoRef = ref(db, parseSegments("restaurants", shopId, "allOrders", orderId, 'basicInfo'));
     return await set(orderInfoRef,  {
      ...order.basicInfo,
      status: "success"
     })
    }
  })

  const orderDetails = {
    orderNumber: order?.id,
    email: user?.email,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    items: convertFirebaseArrayData<TOrderCartItem>(order?.cartItems ?? {}),
    subtotal: order?.basicInfo?.feeSummary?.subTotal,
    shipping: 0,
    paymentProcessingFee: order?.basicInfo.feeSummary.paymentProcessingFee,
    tax: order?.basicInfo?.feeSummary?.tax,
    total: order?.basicInfo?.feeSummary?.total,
  };

  useEffect(() => {
    if (order?.id) {
      useCart.getState().clear();
      updateStatus(order)
    }
  }, [order]);

  console.log(orderDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Order{" "}
              {isLoading ? (
                <Skeleton className="w-[200px] h-4" />
              ) : (
                orderDetails.orderNumber
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  Confirmation sent to
                </p>
                <p className="text-gray-600">{orderDetails.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Estimated delivery</p>
                <p className="text-gray-600">3-5 business days</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-3">
              <p className="font-semibold text-gray-900">Items ordered</p>
              {orderDetails.items.map((item, index) => {
                const totalItem = Number(item?.price ?? 1) * item.quantity;
                const totalModifier = item.modifier
                  ? Number(item.modifier.price ?? 0) * item.quantity
                  : 0;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto] text-sm gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-semibold">
                        {item.name}{" "}
                      </p>
                      <p className="text-gray-500">(Qty: {item.quantity})</p>
                    </div>
                    <p className="font-medium text-gray-500">
                      ${totalItem.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-500 ml-2">
                        Toppings: {item.modifier ? item.modifier.name : "None"}
                      </p>
                      <p className="text-gray-500">
                        (Qty: {item.modifier ? item.quantity : 0})
                      </p>
                    </div>

                    <p className="font-medium text-gray-500">
                      ${totalModifier.toFixed(2)}
                    </p>

                    <p className="col-span-2 font-semibold text-gray-900 text-end ">
                      <span className="border-t border-t-gray-900">
                        Total:{" "}
                      </span>
                      <span className="border-t border-t-gray-900">
                        {(totalModifier + totalItem).toFixed(2)}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${orderDetails?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Online Payment Processing</span>
                <span>${orderDetails?.paymentProcessingFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${orderDetails?.tax?.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${orderDetails?.total?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button asChild variant={"secondary"}>
            <Link to={"/shop/123"}>
              <Home />
              Home
            </Link>
          </Button>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Track Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Additional Info */}
        <Card className="mt-6 bg-blue-50 border-blue-100 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700 text-center">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline font-medium"
              >
                support@example.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
