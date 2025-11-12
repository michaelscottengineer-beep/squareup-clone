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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
    ],
  },
  { path: "/orders/history", element: <UserOrderHistory /> },
  { path: "/shop/:shopId", element: <ShopLayout /> },
  { path: "/shop/:shopId", element: <ShopLayout /> },
  { path: "/checkout/success", element: <SuccessPay /> },
  { path: "/test/img", element: <TestUploadImage /> },
  { path: "/test/state", element: <A /> },
  { path: "/test/dropdown-menu", element: <DropdownMenuTest /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/restaurants/management",
        element: <AdminRestaurant />
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },

      {
        path: "/dashboard/restaurants/rating",
        element: <RestaurantRating />,
      },
      {
        path: "/dashboard/restaurants/management",
        element: <RestaurantManagement />,
      },
      { path: "/dashboard/restaurants/new", element: <RestaurantForm /> },
      {
        path: "/dashboard/restaurants/:restaurantId",
        element: <RestaurantForm />,
      },
      {
        path: "/dashboard/restaurants/settings",
        element: <RestaurantSettingsPage />,
      },
      {
        path: "/dashboard/restaurants/promotions",
        element: <RestaurantPromotion />,
      },
      { path: "/dashboard/notifications", element: <NotificationLayout /> },
      { path: "/dashboard/orders", element: <OrderLayout /> },
      { path: "/dashboard/orders/history", element: <OrderHistory /> },
      { path: "/dashboard/orders/:orderId", element: <OrderDetail /> },
      { path: "/dashboard/items/library", element: <ItemLibraryPage /> },
      {
        path: "/dashboard/items/library/new",
        element: <NewItemCreationPage />,
      },
      {
        path: "/dashboard/items/library/:itemId",
        element: <NewItemCreationPage />,
      },
      { path: "/dashboard/items/modifiers", element: <ModifierHomePage /> },
      { path: "/dashboard/items/modifiers/new", element: <ModifierFormPage /> },
      {
        path: "/dashboard/items/modifiers/:modifierId",
        element: <ModifierFormPage />,
      },
      { path: "/dashboard/items/options", element: <OptionsPage /> },
      { path: "/dashboard/items/options/new", element: <OptionFormPage /> },
      {
        path: "/dashboard/items/options/:optionId",
        element: <OptionFormPage />,
      },
      {
        path: "/dashboard/items/categories",
        element: <CategoriesHomePage />,
        children: [
          {
            path: "/dashboard/items/categories" + "/:cateId",
            element: <CategoryFormPage />,
          },
        ],
      },
    ],
  },
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
