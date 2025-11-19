import "./pos.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";
import PosHeader from "./PosHeader";

const PosLayout = () => {
  return (
    <div>
      <PosHeader></PosHeader>

      <SidebarProvider className="top-pos-header-height relative min-h-[calc(100vh-var(--pos-header-height))]">
        <AppSidebar className="fixed top-pos-header-height bg-white!" />
        <SidebarInset className="h">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default PosLayout;
