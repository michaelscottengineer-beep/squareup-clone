import OrderInvoice from "./components/OrderInvoice";
import CategoryList from "./components/CategoryList";
import OrderLine from "./components/OrderLine";


const OrderLineLayout = () => {
  return (
    <div className="gap-8 grid grid-cols-6 bg-gray-50 ">
      <div className="order-main col-span-4 bg-white px-8 py-8 max-xl:col-span-3 max-xl:px-4">
        <OrderLine />
        <CategoryList />
      </div>
      <OrderInvoice />
    </div>
  );
};

export default OrderLineLayout;
