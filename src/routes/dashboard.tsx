import type { RouteObject } from "react-router";
import DashboardHomePage from "../pages/dashboard/DashboardHomePage";
import CategoriesHomePage from "../pages/dashboard/item-invetory/categories/CategoriesHomePage";
import CategoryFormPage from "../pages/dashboard/item-invetory/categories/CategoryFormPage";
import ItemLibraryPage from "../pages/dashboard/item-invetory/items/ItemLibraryPage";
import NewItemCreationPage from "../pages/dashboard/item-invetory/items/NewItemCreationPage";
import ModifierHomePage from "../pages/dashboard/item-invetory/modifiers/ModifierPage";
import ModifierFormPage from "../pages/dashboard/item-invetory/modifiers/ModifierFormPage";
import OptionsPage from "../pages/dashboard/item-invetory/options/OptionsPage";
import OptionFormPage from "../pages/dashboard/item-invetory/options/OptionFormPage";
import OrderLayout from "../pages/dashboard/orders/OrderLayout";
import OrderDetail from "../pages/dashboard/orders/OrderDetail";
import NotificationLayout from "../pages/notification/NotificationLayout";
import RestaurantSettingsPage from "../pages/restaurants/RestaurantSettingsPage";
import OrderHistory from "../pages/dashboard/orders/OrderHistory";
import RestaurantPromotion from "../pages/restaurants/RestaurantPromotion";
import RestaurantForm from "../pages/restaurants/RestaurantForm";
import RestaurantManagement from "../pages/restaurants/RestaurantManagement";
import RestaurantRating from "../pages/restaurants/RestaurantRating";
import StaffMemberList from "../pages/dashboard/staffs/members/StaffMemberList ";
import MemberForm from "../pages/dashboard/staffs/members/MemberForm";

import DashboardLayout from "../pages/dashboard/DashboardLayout";
import useAuth from "@/hooks/use-auth";
import type { PropsWithChildren } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerLayout from "@/pages/dashboard/customers/CustomerLayout";

const dashboardRoute: RouteObject = {
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <DashboardHomePage />,
    },
    {
      path: "/dashboard/customers/management",
      element: (
        <ProtectedRoute>
          <CustomerLayout />,
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/management",
      element: (
        <ProtectedRoute>
          <RestaurantManagement />,
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/rating",
      element: (
        <ProtectedRoute>
          <RestaurantRating />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/rating",
      element: (
        <ProtectedRoute>
          <RestaurantRating />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/staffs/members",
      element: (
        <ProtectedRoute>
          <StaffMemberList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/staffs/members/new",
      element: (
        <ProtectedRoute>
          <MemberForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/staffs/members/:staffId",
      element: (
        <ProtectedRoute>
          <MemberForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/new",
      element: (
        <ProtectedRoute>
          <RestaurantForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/:restaurantId",
      element: (
        <ProtectedRoute>
          <RestaurantForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/settings",
      element: (
        <ProtectedRoute>
          <RestaurantSettingsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/restaurants/promotions",
      element: (
        <ProtectedRoute>
          <RestaurantPromotion />
        </ProtectedRoute>
      ),
    },
    { path: "/dashboard/notifications", element: <NotificationLayout /> },
    { path: "/dashboard/orders", element: <OrderLayout /> },
    { path: "/dashboard/orders/history", element: <OrderHistory /> },
    { path: "/dashboard/orders/:orderId", element: <OrderDetail /> },
    {
      path: "/dashboard/items/library",
      element: (
        <ProtectedRoute>
          <ItemLibraryPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/library/new",
      element: (
        <ProtectedRoute>
          <NewItemCreationPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/library/:itemId",
      element: (
        <ProtectedRoute>
          <NewItemCreationPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/modifiers",
      element: (
        <ProtectedRoute>
          <ModifierHomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/modifiers/new",
      element: (
        <ProtectedRoute>
          <ModifierFormPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/modifiers/:modifierId",
      element: (
        <ProtectedRoute>
          <ModifierFormPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/options",
      element: (
        <ProtectedRoute>
          <OptionsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/options/new",
      element: (
        <ProtectedRoute>
          <OptionFormPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/options/:optionId",
      element: (
        <ProtectedRoute>
          <OptionFormPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/dashboard/items/categories",
      element: (
        <ProtectedRoute>
          <CategoriesHomePage />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard/items/categories" + "/:cateId",
          element: <CategoryFormPage />,
        },
      ],
    },
  ],
};

export default dashboardRoute;
