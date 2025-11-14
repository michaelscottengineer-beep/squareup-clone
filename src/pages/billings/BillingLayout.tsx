import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";

export default function BillingLayout() {

  return (
    <div className="relative h-[calc(100vh-80px)] ">
      <SidebarProvider className="h-[calc(100vh-80px)]! min-h-[calc(100vh-80px)]! max-h-[calc(100vh-80px)]! ">
        <AppSidebar className="fixed top-20 h-[calc(100vh-80px)]" />
        <SidebarInset className="px-8 py-4">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
