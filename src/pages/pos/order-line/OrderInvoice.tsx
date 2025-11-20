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
import { CiDesktopMouse2 } from "react-icons/ci";
import { useMutation, useQuery } from "@tanstack/react-query";
import PlaceOrderButton from "./PlaceOrderButton";
import { BiMoney, BiScan } from "react-icons/bi";

const Panel = ({ children }: PropsWithChildren) => {
  return <div className="bg-white rounded-xl p-4">{children}</div>;
};

const SectionHeader = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div className={cn("mb-3 flex justify-between", className)}>{children}</div>
  );
};

const SectionContent = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

const SectionTitle = ({ children }: PropsWithChildren) => {
  return <div className="font-medium text-lg">{children}</div>;
};

const SectionItemText = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn("text-gray-400", className)}>{children}</div>;
};

const SectionItemRow = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div className={cn("flex justify-between items-centers", className)}>
      {children}
    </div>
  );
};

const methods = [
  { icon: BsCashCoin, label: "cash" },
  { icon: GoCreditCard, label: "card" },
  { icon: BiScan, label: "scan" },
];

const TableNo = () => {
  const orderId = usePosOrderLineState((state) => state.orderId);
  const setTableNo = usePosOrderLineState((state) => state.setTableNo);
  const tableNo = usePosOrderLineState((state) => state.tableNo);
  const [text, setText] = useState(tableNo);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="info section flex flex-col gap-1">
      <SectionHeader className="mb-0">
        <SectionTitle>
          {isEdit ? (
            <Input
              className=""
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            `Table No ${tableNo.padStart(2, "0")}`
          )}
        </SectionTitle>
        <div className="flex items-center gap-1">
          {isEdit ? (
            <Check
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => {
                setIsEdit(false);
                setTableNo(text);
              }}
            />
          ) : (
            <Edit2
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setIsEdit(true)}
            />
          )}
          <Trash className="w-4 h-4 text-destructive cursor-pointer" />
        </div>
      </SectionHeader>

      <SectionItemRow>
        <SectionItemText className="font-medium">
          Order: {orderId}
        </SectionItemText>
        {/* <span className="font-medium">2 People</span> */}
      </SectionItemRow>
    </div>
  );
};

import { RiSaveLine } from "react-icons/ri";
import PlaceDraftOrderButton from "./PlaceDraftOrderButton";
import useCurrentRestaurantId from "@/stores/use-current-restaurant-id.store";
import orderFirebaseKey from "@/factory/order/order.firebaseKey";
import { get } from "firebase/database";
import type { TOrderDocumentData } from "@/types/checkout";
import type { TCartItem } from "@/types/item";
import PaidButton from "./PaidButton";

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
    <div className="order-invoice col-span-2 sticky top-[calc(var(--pos-header-height)+2rem )] my-4 mr-4 space-y-8 font-medium flex flex-col h-max">
      <Panel>
        <TableNo />
        <DashedHr className="my-4" />

        <div className="ordered-items">
          <SectionHeader>
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

      <div className="grid grid-cols-3 gap-4">
        <Button className="bg-white! text-gray-500">
          <IoMdPrint />
          <span>Print</span>
        </Button>

        {data?.basicInfo.orderStatus === "accepted" ? (
          <PaidButton />
        ) : (
          <>
            <PlaceDraftOrderButton />
            <PlaceOrderButton />
          </>
        )}
      </div>
    </div>
  );
};

const MethodList = () => {
  const setPaymentMethod = usePosOrderLineState(
    (state) => state.setPaymentMethod
  );
  const paymentMethod = usePosOrderLineState((state) => state.paymentMethod);

  return (
    <div className="flex items-center justify-center gap-4">
      {methods.map((item, i) => {
        const isSelected = paymentMethod === item.label;
        return (
          <Button
            className={cn(
              "border rounded-md flex-1 text-gray-400 max-w-32 items-center flex gap-2 bg-transparent hover:bg-transparent",
              {
                "border-primary text-primary": isSelected,
              }
            )}
            onClick={() => setPaymentMethod(item.label)}
          >
            <item.icon
              className={cn("", {
                "text-primary": isSelected,
              })}
            />
            <span
              className={cn("", {
                "text-black": isSelected,
              })}
            >
              {item.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
export default OrderInvoice;
