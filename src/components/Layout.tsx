import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/50 dark:bg-gray-900/50">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
            <SidebarTrigger className="lg:hidden mb-4" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};