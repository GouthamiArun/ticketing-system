"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import UserStatusGuard from "@/components/UserStatusGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getMe();
        setIsAuthenticated(!!response.data);

        // If authenticated and on public page, redirect to dashboard
        if (response.data && !requireAuth) {
          const role = response.data.role;
          if (pathname === "/" || pathname === "/login") {
            router.replace(
              `/${
                role === "admin"
                  ? "admin"
                  : role === "agent"
                  ? "agent"
                  : "employee"
              }/dashboard`
            );
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        // If not authenticated and on protected page, redirect to login
        if (requireAuth && pathname !== "/login" && pathname !== "/") {
          router.replace("/login");
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, requireAuth, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Public routes - allow if not requiring auth or if checking
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Protected routes - only show if authenticated, wrapped with UserStatusGuard
  if (requireAuth && isAuthenticated) {
    return <UserStatusGuard>{children}</UserStatusGuard>;
  }

  return null;
}
