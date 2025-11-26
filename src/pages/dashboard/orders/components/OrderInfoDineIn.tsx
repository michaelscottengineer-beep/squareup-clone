import type { TOrder } from "@/types/checkout";

const OrderInfoDineIn = ({ order }: { order: TOrder }) => {
  return (
    <>
      <div className="grid grid-cols-2">
        <span>Table Number:</span>
        <span className="text-end">{order.basicInfo.dineIn.tableNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Phone Number:</span>
        <span className="text-end">{order.basicInfo.dineIn.phoneNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>FullName:</span>
        <span className="text-end">{order.basicInfo.dineIn.yourName}</span>
      </div>
    </>
  );
};

export default OrderInfoDineIn;