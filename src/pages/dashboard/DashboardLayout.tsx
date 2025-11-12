import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";
import NotificationBellRingMp3 from "@/components/NotificationBellRingMp3";
import { Button } from "@/components/ui/button";
import useBellSound from "@/stores/use-bell-sound";

export default function DashboardPage() {
  const set = useBellSound((state) => state.set);

  return (
    <div>
      <div className="w-screen h-20 fixed top-0 z-50 left-0 bg-accent-promo/5">
        Header
      </div>
      <div className="relative h-[calc(100vh-80px)] top-20">
        <SidebarProvider className="h-[calc(100vh-80px)]! min-h-[calc(100vh-80px)]! max-h-[calc(100vh-80px)]! ">
          <AppSidebar className="fixed top-20 left-0 h-[calc(100vh-80px)]" />
          <SidebarInset>
            <main className="flex-1">
      

              <div className=" px-10 py-10">
                <Outlet />
              </div>

            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
