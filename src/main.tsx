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
  { path: "/shop/:shopId", element: <ShopLayout /> },
  { path: "/checkout/success", element: <SuccessPay /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },

      { path: "/dashboard/orders", element: <OrderLayout /> },
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
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
