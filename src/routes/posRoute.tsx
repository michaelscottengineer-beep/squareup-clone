import type { RouteObject } from "react-router";
import PosLayout from "@/pages/pos/PosLayout";
import OrderLineLayout from "@/pages/pos/order-line/OrderLineLayout";
import TableManagementLayout from "@/pages/pos/manage-table/TableManagementLayout";

const posRoute: RouteObject =  {
    path: "/pos",
    element: <PosLayout />,
    children: [
      {
        path: "order-line",
        element: <OrderLineLayout />,
      },
      {
        path: "manage-table",
        element: <TableManagementLayout />,
      },
    ],
  }

export default posRoute;
