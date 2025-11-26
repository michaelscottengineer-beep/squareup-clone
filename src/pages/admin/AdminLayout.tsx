import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import useAuth from "@/hooks/use-auth";



export default function AdminLayout() {
  const {user} = useAuth();
  if (user?.role !== "admin") return <div className="h-max w-max m-auto font-medium">You dont have permission!</div>
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
