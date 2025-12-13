import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootPage from "./pages/Root.js";
import LoginPage from "./pages/auth/LoginPage.js";
import RegisterPage from "./pages/auth/RegisterPage.js";
import { Toaster } from "./components/ui/sonner.js";
import AuthProvider from "./contexts/auth.js";
import HomePage from "./pages/home/HomePage.js";

import ShopLayout from "./pages/shop/ShopLayout.js";
import SuccessPay from "./pages/checkout/SuccessPage.js";
import TestUploadImage from "./pages/experiments/TestUploadImage.js";
import NotificationBellRingMp3 from "./components/NotificationBellRingMp3.js";
import A from "./pages/experiments/test-use-state/A.js";
import PrefetchRestaurantIds from "./PrefetchRestaurantIds.js";
import AdminLayout from "./pages/admin/AdminLayout.js";
import AdminRestaurant from "./pages/admin/restaurants/AdminRestaurant.js";
import DropdownMenuTest from "./pages/experiments/DropdownMenuTest.js";
import UserOrderHistory from "./pages/orders/UserOrderHistory.js";
import BillingLayout from "./pages/billings/BillingLayout.js";
import BillingTransaction from "./pages/billings/trasaction/BillingTransaction.js";
import BillingListCards from "./pages/billings/cards/BillingListCards.js";
import dashboardRoute from "./routes/dashboard.js";
import StaffSetup from "./pages/staff-setup/StaffSetup.js";
import PosLayout from "./pages/pos/PosLayout.js";
import OrderLineLayout from "./pages/pos/order-line/OrderLineLayout.js";
import TableManagementLayout from "./pages/pos/manage-table/TableManagementLayout.js";
import ScreenInvoicePreviewPage from "./pages/screen-invoice-preview/ScreenInvoicePreviewPage.js";
import webBuilderRouter from "./routes/webBuilderRoute.js";
import NotFound from "./components/NotFound.js";
import experimentRoute from "./routes/experimentRoute.js";
import posRoute from "./routes/posRoute.js";
import brevoRoute from "./routes/brevoRoute.js";
import MailTemplateBuilderEditor from "./pages/mailTemplateBuilder/MailTemplateBuilderEditor/index.js";
import { AppRouterProvider } from "./contexts/appRouterContext.js";
import MailTemplateBuilder1 from "./pages/mailTemplateBuilder/MailTemplateBuilder1.js";

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
      ...experimentRoute,
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
  ...webBuilderRouter,
  {
    path: "/invoice-preview",
    element: <ScreenInvoicePreviewPage />,
  },
  {
    path: "/setup/:invitingId",
    element: <StaffSetup />,
  },
  { ...posRoute },
  { ...dashboardRoute },
  {
    path: "/signin",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },

  { ...brevoRoute },
  {
    path: "/mail-template-builder",

    children: [
      {
        index: true,
        element: (
          <AppRouterProvider>
            <Outlet />
          </AppRouterProvider>
        ),
      },
      {
        path: "template1",
        element: (
          <AppRouterProvider>
            <MailTemplateBuilder1 />
          </AppRouterProvider>
        ),
      },
      {
        path: "editor/:mailTemplateId",
        element: (
          <AppRouterProvider>
            <MailTemplateBuilderEditor />
          </AppRouterProvider>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
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
