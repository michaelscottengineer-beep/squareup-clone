import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet } from "react-router";
// import useBellSound from "@/stores/use-bell-sound";

export default function DashboardPage() {
  // const set = useBellSound((state) => state.set);

  return (
    <div>
      <div className="relative  ">
        <SidebarProvider className="! min-! max-! ">
          <AppSidebar className="fixed  " />
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
