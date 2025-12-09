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

import ShopLayout from "./pages/shop/ShopLayout";
import SuccessPay from "./pages/checkout/SuccessPage";
import TestUploadImage from "./pages/experiments/TestUploadImage";
import NotificationBellRingMp3 from "./components/NotificationBellRingMp3";
import A from "./pages/experiments/test-use-state/A";
import PrefetchRestaurantIds from "./PrefetchRestaurantIds";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminRestaurant from "./pages/admin/restaurants/AdminRestaurant";
import DropdownMenuTest from "./pages/experiments/DropdownMenuTest";
import UserOrderHistory from "./pages/orders/UserOrderHistory";
import BillingLayout from "./pages/billings/BillingLayout";
import BillingTransaction from "./pages/billings/trasaction/BillingTransaction";
import BillingListCards from "./pages/billings/cards/BillingListCards";
import dashboardRoute from "./routes/dashboard";
import StaffSetup from "./pages/staff-setup/StaffSetup";
import PosLayout from "./pages/pos/PosLayout";
import OrderLineLayout from "./pages/pos/order-line/OrderLineLayout";
import TableManagementLayout from "./pages/pos/manage-table/TableManagementLayout";
import ScreenInvoicePreviewPage from "./pages/screen-invoice-preview/ScreenInvoicePreviewPage";
import webBuilderRouter from "./routes/webBuilderRoute";
import NotFound from "./components/NotFound";
import experimentRoute from "./routes/experimentRoute";
import posRoute from "./routes/posRoute";
import BrevoLayout from "./pages/brevo/BrevoLayout";
import ContactPage from "./pages/brevo/contact/ContactPage";
import ListPage from "./pages/brevo/list/ListPage";
import ListDetails from "./pages/brevo/list/ListDetails";
import CampaignLayout from "./pages/brevo/marketing/campaign/CampaignLayout";
import CreationSmsCampaignPage from "./pages/brevo/marketing/campaign/CreationSmsCampaignPage";
import SmsCampaignEditionPage from "./pages/brevo/marketing/campaign/SmsCampaign/SmsCampaignEditionPage";
import SmsCampaignDesignMessagePage from "./pages/brevo/marketing/campaign/SmsCampaign/SmsCampaignDesignMessagePage";
import EmailCampaignCreationPage from "./pages/brevo/marketing/campaign/EmailCampaign/EmailCampaignCreationPage";
import EmailCampaignEditorPage from "./pages/brevo/marketing/campaign/EmailCampaign/EmailCampaignEditorPage";

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

  {
    path: "/brevo",
    element: <BrevoLayout />,
    children: [
      {
        path: "/brevo/contact",
        element: <ContactPage />,
      },
      {
        path: "/brevo/list",
        element: <ListPage />,
      },
      {
        path: "/brevo/list/:listId",
        element: <ListDetails />,
      },
      {
        path: "/brevo/campaign",
        element: <CampaignLayout />,
      },
      {
        path: "/brevo/email-campaign/campaign-setup",
        element: <EmailCampaignCreationPage />,
      },
      {
        path: "/brevo/email-campaign/edit/:campaignId",
        element: <EmailCampaignEditorPage />,
      },
      {
        path: "/brevo/sms-campaign/campaign-setup",
        element: <CreationSmsCampaignPage />,
      },
      {
        path: "/brevo/sms-campaign/edit/:campaignId",
        element: <SmsCampaignEditionPage />,
      },
      {
        path: "/brevo/sms-campaign/design/:campaignId",
        element: <SmsCampaignDesignMessagePage />,
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
