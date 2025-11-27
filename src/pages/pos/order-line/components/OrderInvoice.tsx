import DashedHr from "@/components/ui/dashed-hr";
import { cn } from "@/lib/utils";
import { Check, Edit2, Trash } from "lucide-react";
import React, {
  Fragment,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { BsCashCoin } from "react-icons/bs";
import { GoCreditCard } from "react-icons/go";
import { CgPhotoscan } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import usePosOrderLineState, {
  usePosOrderLineSubtotal,
  type TSelectedItem,
} from "@/stores/use-pos-order-line-state";
import { POS_PAYMENT } from "@/config";
import { Input } from "@/components/ui/input";
import { IoMdPrint } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import PlaceOrderButton from "./PlaceOrderButton";
import PlaceDraftOrderButton from "./PlaceDraftOrderButton";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import { get } from "firebase/database";
import type { TOrderDocumentData } from "@/types/checkout";
import type { TCartItem } from "@/types/item";
import PaidButton from "./PaidButton";
import {
  Panel,
  SectionContent,
  SectionHeader,
  SectionItemRow,
  SectionItemText,
  SectionTitle,
} from "./order-invoice";
import TableNo from "./order-invoice/TableNo";
import MethodList from "./order-invoice/MethodList";
import InvoiceActionButtons from "./order-invoice/InvoiceActionButtons";

const OrderInvoice = () => {
  const selectedItems = usePosOrderLineState((state) => state.selectedItems);
  const orderId = usePosOrderLineState((state) => state.orderId);
  const restaurantId = useCurrentRestaurantId((state) => state.id);

  const setTableNo = usePosOrderLineState((state) => state.setTableNo);
  const setSelectedItem = usePosOrderLineState(
    (state) => state.setSelectedItems
  );

  const { data } = useQuery({
    queryKey: ["restaurants", restaurantId, "allOrders", orderId],
    queryFn: async () => {
      const orderRef = orderFirebaseKey({ orderId, restaurantId }).detailsRef();

      const doc = await get(orderRef);

      return { ...doc.val(), id: orderId } as TOrderDocumentData;
    },
    enabled: !!restaurantId && !!orderId,
  });

  const calcPriceOfItem = (price: number, amount: number) => {
    return (price * amount).toFixed(2);
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      const items = Object.entries(data.cartItems).map(
        ([key, item]) =>
          ({
            amount: item.quantity,
            name: item.name,
            image: item.image,
            categories: [],
            description: "",
            id: key,
            modifiers: [],
            note: "",
            price: item.price,
            promotions: [],
            type: "",
          } as TCartItem)
      );

      const newItems = items.reduce((acc, item) => {
        acc[item.id] = {
          amount: item.amount,
          name: item.name,
          image: item.image,
          categories: [],
          description: "",
          id: "123",
          modifiers: [],
          note: "",
          price: item.price,
          promotions: [],
          type: "",
        };

        return acc;
      }, {} as TSelectedItem);

      setSelectedItem(newItems);

      setTableNo(data.basicInfo.dineIn.tableNumber);
    }
  }, [data]);

  const subTotal = usePosOrderLineSubtotal();

  return (
    <div className="order-invoice col-span-2 sticky max-xl:col-span-3 top-[calc(var(--pos-header-height)+2rem )] my-4 mr-4 space-y-8 font-medium flex flex-col h-max">
      <Panel>
        <TableNo />
        <DashedHr className="my-4" />

        <div className="ordered-items">
          <SectionHeader className="items-end">
            <SectionTitle>Ordered Items</SectionTitle>
            <span className="text-gray-400 font-medium">
              {Object.keys(selectedItems).length.toString()}
            </span>
          </SectionHeader>

          <SectionContent>
            {Object.values(selectedItems).map((item) => {
              return (
                <SectionItemRow key={item.id}>
                  <SectionItemText>
                    <span>{item.amount}x</span>{" "}
                    <span className="capitalize">{item.name}</span>
                  </SectionItemText>
                  <div className="font-medium">
                    ${calcPriceOfItem(Number(item.price), item.amount)}
                  </div>
                </SectionItemRow>
              );
            })}
          </SectionContent>
        </div>

        <DashedHr className="my-4" />
        <div className="payment">
          <SectionHeader>
            <SectionTitle>Payment Summery</SectionTitle>
          </SectionHeader>
          <SectionItemRow>
            <SectionItemText className="">Subtotal</SectionItemText>
            <div>${subTotal.toFixed(2)}</div>
          </SectionItemRow>
          <SectionItemRow>
            <SectionItemText className="">Tax</SectionItemText>
            <div>${POS_PAYMENT.TAX.toFixed(2)}</div>
          </SectionItemRow>
        </div>
        <DashedHr className="my-4" />
        <div className="total text-lg font-medium">
          <SectionItemRow>
            <SectionItemText className="text-black">Total</SectionItemText>
            <div>${(subTotal + POS_PAYMENT.TAX).toFixed(2)}</div>
          </SectionItemRow>
        </div>
      </Panel>

      <Panel>
        <SectionHeader>
          <SectionTitle>Payment Methods</SectionTitle>
        </SectionHeader>
        <MethodList />
      </Panel>

      <InvoiceActionButtons orderStatus={data?.basicInfo.orderStatus} />
    </div>
  );
};

export default OrderInvoice;
