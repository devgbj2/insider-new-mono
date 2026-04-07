import { AppSidebar } from "./sidebar";
import { AppBreadcrumb } from "./breadcrumb";
import { Outlet } from "react-router-dom";

import {
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>

      <AppSidebar />

      <SidebarInset>

        <AppBreadcrumb />
        
        <div className="bg-gray-100/50">

          <main className="p-6 min-h-[88vh]">
            <Outlet />
          </main>

          <footer className="text-center text-xs mb-4">
            <p>&copy; 2025 PT TIF Hak Cipta dilindungi undang-undang</p>
          </footer>
        </div>

      </SidebarInset>

    </SidebarProvider>
  );
}