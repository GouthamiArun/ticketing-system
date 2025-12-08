"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ticketService } from "@/services/ticketService";
import { serviceRequestService } from "@/services/serviceRequestService";
import { authService } from "@/services/authService";
import {
  TicketIcon,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalRequests: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    pendingRequests: 0,
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ticketsResponse, requestsResponse, userResponse] =
        await Promise.all([
          ticketService.getTickets({ my: true }),
          serviceRequestService.getServiceRequests({ my: true }),
          authService.getMe(),
        ]);

      const tickets = ticketsResponse.data || [];
      const requests = requestsResponse.data || [];

      setUserRole(userResponse.data?.role || "");

      setStats({
        totalTickets: tickets.length,
        totalRequests: requests.length,
        openTickets: tickets.filter((t: any) => t.status === "Open").length,
        inProgressTickets: tickets.filter(
          (t: any) => t.status === "In Progress"
        ).length,
        resolvedTickets: tickets.filter(
          (t: any) => t.status === "Resolved" || t.status === "Closed"
        ).length,
        pendingRequests: requests.filter((r: any) => r.status === "Pending")
          .length,
      });

      setRecentTickets(tickets.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Open: "text-blue-600 bg-blue-50",
      "In Progress": "text-orange-600 bg-orange-50",
      Resolved: "text-green-600 bg-green-50",
      Closed: "text-gray-600 bg-gray-50",
      Rejected: "text-red-600 bg-red-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      Low: "text-gray-600 bg-gray-100",
      Medium: "text-blue-600 bg-blue-100",
      High: "text-orange-600 bg-orange-100",
      Critical: "text-red-600 bg-red-100",
    };
    return colors[priority] || "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's an overview of your tickets and requests.
          </p>
        </div>

        {/* Quick Actions */}
        {userRole !== "Agent" && userRole !== "agent" && (
          <div className="flex flex-wrap gap-3">
            <Link href="/employee/tickets/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </Link>
            <Link href="/employee/service-requests/create">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Service Request
              </Button>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Tickets */}
          <Card className="border-2 border-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Tickets
                </CardTitle>
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalTickets}
              </div>
              <Link href="/employee/tickets">
                <Button variant="link" className="px-0 text-blue-600 text-sm">
                  View all tickets →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Open Tickets */}
          <Card className="border-2 border-orange-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Open Tickets
                </CardTitle>
                <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.openTickets}
              </div>
              <p className="text-sm text-gray-600 mt-1">Awaiting assignment</p>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-2 border-purple-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  In Progress
                </CardTitle>
                <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.inProgressTickets}
              </div>
              <p className="text-sm text-gray-600 mt-1">Being worked on</p>
            </CardContent>
          </Card>

          {/* Resolved Tickets */}
          <Card className="border-2 border-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Resolved
                </CardTitle>
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.resolvedTickets}
              </div>
              <p className="text-sm text-gray-600 mt-1">Completed tickets</p>
            </CardContent>
          </Card>

          {/* Service Requests */}
          <Card className="border-2 border-cyan-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Service Requests
                </CardTitle>
                <div className="w-10 h-10 bg-cyan-100 flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">
                {stats.totalRequests}
              </div>
              <Link href="/employee/service-requests">
                <Button variant="link" className="px-0 text-cyan-600 text-sm">
                  View all requests →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="border-2 border-yellow-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Approval
                </CardTitle>
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pendingRequests}
              </div>
              <p className="text-sm text-gray-600 mt-1">Awaiting review</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
