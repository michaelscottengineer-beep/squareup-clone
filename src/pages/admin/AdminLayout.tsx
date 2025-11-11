import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import NotificationBellRingMp3 from "@/components/NotificationBellRingMp3";
import { Button } from "@/components/ui/button";
import useBellSound from "@/stores/use-bell-sound";
import { AppSidebar } from "./AppSidebar";



export default function AdminLayout() {

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
