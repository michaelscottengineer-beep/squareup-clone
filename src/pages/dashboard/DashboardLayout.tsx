import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet } from "react-router";
// import useBellSound from "@/stores/use-bell-sound";

export default function DashboardPage() {
  // const set = useBellSound((state) => state.set);

  return (
    <div>
      <div className="relative  ">
        <SidebarProvider className="">
          <AppSidebar className="fixed " />
          <SidebarInset className="max-w-[calc(100%-var(--sidebar-width))] p-4 max-sm:max-w-full">
            <Outlet />
            <SidebarTrigger className="absolute -left-2" />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
