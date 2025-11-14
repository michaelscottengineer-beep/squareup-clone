import { convertFirebaseArrayData } from "@/utils/helper";
import type { TOrderCartItem, TOrderDocumentData } from "@/types/checkout";
import { cn } from "@/lib/utils";

const OrderItemSection = ({ order }: { order: TOrderDocumentData }) => {
  return (
    <div className="order-items mt-8  border border-border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-semibold">Order Items</h2>
      {convertFirebaseArrayData<TOrderCartItem>(order.cartItems).map(
        (item, i) => {
          const totalItem = Number(item?.price ?? 1) * item.quantity;
          const totalModifier = item.modifier
            ? Number(item.modifier.price ?? 0) * item.quantity
            : 0;

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-4 border-b border-border pb-2",
                {
                  "border-b-0":
                    i === Object.keys(order?.cartItems ?? {}).length - 1,
                }
              )}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt="img-item"
                  className="w-8 h-8 rounded-md"
                />
              ) : (
                <div className="img w-8 bg-red-50 rounded-lg h-full aspect-square"></div>
              )}
              <div className="grid grid-cols-[1fr_auto] text-sm gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-semibold">{item.name} </p>
                  <p className="text-gray-500">(Qty: {item.quantity})</p>
                </div>
                <p className="font-medium text-gray-500">
                  ${totalItem.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500">
                    Toppings: {item.modifier ? item.modifier.name : "None"}
                  </p>
                  <p className="text-gray-500">
                    (Qty: {item.modifier ? item.quantity : 0})
                  </p>
                </div>

                <p className="font-medium text-gray-500">
                  ${totalModifier.toFixed(2)}
                </p>

                <p className="col-span-2 font-semibold text-gray-900 text-end mt-2">
                  <span className="border-t border-t-gray-900">Total: </span>
                  <span className="border-t border-t-gray-900">
                    {(totalModifier + totalItem).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default OrderItemSection;
