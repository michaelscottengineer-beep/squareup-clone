import type { TOrder } from "@/types/checkout";

const OrderInfoDelivery = ({ order }: { order: TOrder }) => {
  const delivery = order.basicInfo.delivery;
  const { yourAddress } = delivery.deliveryInfo;

  return (
    <>
      <div className="grid grid-cols-2">
        <span>Phone Number:</span>
        <span className="text-end">{delivery.phoneNumber}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>FullName:</span>
        <span className="text-end">{delivery.yourName}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Street Address:</span>
        <span className="text-end">{yourAddress.streetAddress}</span>
      </div>
      <div className="grid grid-cols-2">
        <span>Received At:</span>
        <span className="text-end">{yourAddress.receivedAt}</span>
      </div>
      <div className="grid grid-cols-2">
        <span>City:</span>
        <span className="text-end">{yourAddress.city}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>State:</span>
        <span className="text-end">{yourAddress.state}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Notes:</span>
        <span className="text-end">{delivery.deliveryInfo.note}</span>
      </div>

      <div className="grid grid-cols-2">
        <span>Drop-off:</span>
        <span className="text-end">{delivery.deliveryInfo.dropOffOption}</span>
      </div>
    </>
  );
};

export default OrderInfoDelivery;
