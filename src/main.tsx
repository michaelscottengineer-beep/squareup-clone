import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootPage from "./pages/Root";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./contexts/auth";
import HomePage from "./pages/home/HomePage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import CategoriesHomePage from "./pages/dashboard/item-invetory/categories/CategoriesHomePage";
import CategoryFormPage from "./pages/dashboard/item-invetory/categories/CategoryFormPage";
import ItemLibraryPage from "./pages/dashboard/item-invetory/items/ItemLibraryPage";
import NewItemCreationPage from "./pages/dashboard/item-invetory/items/NewItemCreationPage";
import ModifierHomePage from "./pages/dashboard/item-invetory/modifiers/ModifierPage";
import ModifierFormPage from "./pages/dashboard/item-invetory/modifiers/ModifierFormPage";
import OptionsPage from "./pages/dashboard/item-invetory/options/OptionsPage";
import OptionFormPage from "./pages/dashboard/item-invetory/options/OptionFormPage";
import ShopLayout from "./pages/shop/ShopLayout";
import SuccessPay from "./pages/checkout/SuccessPage";
import OrderLayout from "./pages/dashboard/orders/OrderLayout";
import OrderDetail from "./pages/dashboard/orders/OrderDetail";
import TestUploadImage from "./pages/experiments/TestUploadImage";
import NotificationLayout from "./pages/notification/NotificationLayout";
import NotificationBellRingMp3 from "./components/NotificationBellRingMp3";
import RestaurantSettingsPage from "./pages/restaurants/RestaurantSettingsPage";
import OrderHistory from "./pages/dashboard/orders/OrderHistory";
import RestaurantPromotion from "./pages/restaurants/RestaurantPromotion";
import RestaurantForm from "./pages/restaurants/RestaurantForm";
import A from "./pages/experiments/test-use-state/A";
import RestaurantEditForm from "./pages/restaurants/RestaurantEditForm";
import RestaurantManagement from "./pages/restaurants/RestaurantManagement";
import PrefetchRestaurantIds from "./PrefetchRestaurantIds";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminRestaurant from "./pages/admin/restaurants/AdminRestaurant";
import DropdownMenuTest from "./pages/experiments/DropdownMenuTest";
import UserOrderHistory from "./pages/orders/UserOrderHistory";
import RestaurantRating from "./pages/restaurants/RestaurantRating";
import BillingLayout from "./pages/billings/BillingLayout";
import BillingTransaction from "./pages/billings/trasaction/BillingTransaction";
import BillingListCards from "./pages/billings/cards/BillingListCards";
import StaffMemberList from "./pages/dashboard/staffs/members/StaffMemberList ";
import MemberForm from "./pages/dashboard/staffs/members/MemberForm";
import dashboardRoute from "./routes/dashboard";
import StaffSetup from "./pages/setup/StaffSetup";
import PosLayout from "./pages/pos/PosLayout";
import OrderLineLayout from "./pages/pos/order-line/OrderLineLayout";
import TableManagementLayout from "./pages/pos/manage-table/TableManagementLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: "/billings",
        element: <BillingLayout />,
        children: [
          { path: "/billings/transactions", element: <BillingTransaction /> },
          { path: "/billings/cards", element: <BillingListCards /> },
        ],
      },
      { path: "/orders/history", element: <UserOrderHistory /> },
      { path: "/shop/:shopId", element: <ShopLayout /> },
      { path: "/shop/:shopId", element: <ShopLayout /> },
      { path: "/checkout/success", element: <SuccessPay /> },
      { path: "/test/img", element: <TestUploadImage /> },
      { path: "/test/state", element: <A /> },
      { path: "/test/dropdown-menu", element: <DropdownMenuTest /> },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/restaurants/management",
        element: <AdminRestaurant />,
      },
    ],
  },
  {
    path: "/setup/:invitingId",
    element: <StaffSetup />,
  },
  {
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
  },
  { ...dashboardRoute },
  {
    path: "/signin",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationBellRingMp3 />
        <RouterProvider router={router} />
        <PrefetchRestaurantIds />
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
