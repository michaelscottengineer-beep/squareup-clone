import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
]);

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import RootPage from "./pages/Root";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />,
    </QueryClientProvider>
  </StrictMode>
);
