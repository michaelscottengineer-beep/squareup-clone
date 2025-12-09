import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./components/AppSidebar";
import { Outlet } from "react-router";

const BrevoLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BrevoLayout;
