"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/useToast";
import { User } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        userRole={user.role}
        userName={user.name}
        userEmail={user.email}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-72"
        }`}
      >
        {/* Header with Profile Info */}
        <header className="bg-white border-b border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <Link
              href="/employee/profile"
              className="flex items-center gap-3 hover:bg-gray-50 px-3 py-1.5 transition-colors rounded"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-9 h-9 bg-blue-100 flex items-center justify-center rounded">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </Link>
          </div>
        </header>

        <div className="pt-0">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
