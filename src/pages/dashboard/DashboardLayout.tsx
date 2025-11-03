import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />

        <div className=" px-10 py-10">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
