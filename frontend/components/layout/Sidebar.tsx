"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Plus,
  List,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  BarChart3,
  FolderKanban,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  subItems?: { label: string; href: string }[];
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/employee",
    roles: ["employee"],
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/agent",
    roles: ["agent"],
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    roles: ["admin"],
  },
  {
    label: "Tickets",
    icon: Ticket,
    roles: ["employee"],
    subItems: [
      { label: "Create Ticket", href: "/employee/tickets/create" },
      { label: "My Tickets", href: "/employee/tickets" },
    ],
  },
  {
    label: "Service Requests",
    icon: Wrench,
    roles: ["employee"],
    subItems: [
      { label: "Create Request", href: "/employee/service-requests/create" },
      { label: "My Requests", href: "/employee/service-requests" },
    ],
  },
  {
    label: "Assigned Tickets",
    icon: FolderKanban,
    href: "/agent/tickets",
    roles: ["agent"],
  },
  {
    label: "Assigned Requests",
    icon: List,
    href: "/agent/service-requests",
    roles: ["agent"],
  },
  {
    label: "All Tickets",
    icon: Ticket,
    href: "/admin/tickets",
    roles: ["admin"],
  },
  {
    label: "All Service Requests",
    icon: Wrench,
    href: "/admin/service-requests",
    roles: ["admin"],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    roles: ["admin"],
  },
  {
    label: "User Management",
    icon: Users,
    href: "/admin/users",
    roles: ["admin"],
  },
  {
    label: "Categories",
    icon: Settings,
    href: "/admin/categories",
    roles: ["admin"],
  },
  {
    label: "Profile",
    icon: User,
    href: "/employee/profile",
    roles: ["employee", "agent", "admin"],
  },
];

interface SidebarProps {
  userRole: string;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  userRole,
  userName,
  userEmail,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const isActive = (href?: string): boolean => {
    if (!href || !pathname) return false;

    const cleanPath = pathname.replace(/\/$/, "");
    const cleanHref = href.replace(/\/$/, "");

    if (cleanPath === cleanHref) return true;

    if (["/employee", "/agent", "/admin"].includes(cleanHref)) {
      return false;
    }

    return false;
  };

  // Check if any submenu item is active
  const hasActiveChild = (subItems?: { label: string; href: string }[]) => {
    if (!subItems) return false;
    return subItems.some((sub) => isActive(sub.href));
  };

  // Auto-expand submenu if a child page is active
  useEffect(() => {
    if (isCollapsed) {
      setExpandedItem(null);
      return;
    }

    const activeParent = filteredMenuItems.find(
      (item) => item.subItems && hasActiveChild(item.subItems)
    );

    if (activeParent) {
      setExpandedItem(activeParent.label);
    }
  }, [pathname, isCollapsed]);

  // Close expanded items when collapsed
  useEffect(() => {
    if (isCollapsed) {
      setExpandedItem(null);
    }
  }, [isCollapsed]);

  const toggleSubMenu = (label: string) => {
    if (isCollapsed) return;
    setExpandedItem(expandedItem === label ? null : label);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          }`}
        >
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">IT Support</h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.subItems) {
            const isExpanded = expandedItem === item.label;
            const isChildActive = hasActiveChild(item.subItems);

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSubMenu(item.label)}
                  className={`w-full flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } px-3 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                    isChildActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "" : "gap-3"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </button>

                {/* Accordion Content - Fixed Animation */}
                {!isCollapsed && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 mt-1 space-y-1 pb-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors rounded-lg ${
                              isActive(subItem.href)
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              } px-3 py-2.5 text-sm font-medium transition-colors rounded-lg ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-gray-200">
        <Button
          onClick={onLogout}
          variant="outline"
          className={`w-full ${
            isCollapsed ? "justify-center px-2" : "justify-start gap-3"
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900">IT Support</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 transform transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed left-0 top-0 bottom-0 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-72"
        }`}
      >
        <SidebarContent />
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}
