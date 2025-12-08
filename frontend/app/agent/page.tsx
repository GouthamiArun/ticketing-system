"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketService } from "@/services/ticketService";
import { serviceRequestService } from "@/services/serviceRequestService";
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Wrench,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AgentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [serviceRequestStats, setServiceRequestStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load assigned tickets
      const ticketsResponse = await ticketService.getTickets({
        assignedTo: "me",
      });
      const tickets = ticketsResponse.data || [];

      // Calculate ticket stats
      const ticketStatsData = {
        total: tickets.length,
        open: tickets.filter((t: any) => t.status === "Open").length,
        inProgress: tickets.filter((t: any) => t.status === "In Progress")
          .length,
        resolved: tickets.filter((t: any) => t.status === "Resolved").length,
      };
      setTicketStats(ticketStatsData);
      setRecentTickets(tickets.slice(0, 5));

      // Load assigned service requests
      const requestsResponse = await serviceRequestService.getServiceRequests({
        assignedTo: "me",
      });
      const requests = requestsResponse.data || [];

      // Calculate service request stats
      const requestStatsData = {
        total: requests.length,
        pending: requests.filter((r: any) => r.status === "Pending").length,
        inProgress: requests.filter((r: any) => r.status === "In Progress")
          .length,
        completed: requests.filter((r: any) => r.status === "Completed").length,
      };
      setServiceRequestStats(requestStatsData);
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Open: "text-blue-600 bg-blue-50 border-blue-200",
      "In Progress": "text-orange-600 bg-orange-50 border-orange-200",
      Resolved: "text-green-600 bg-green-50 border-green-200",
      Pending: "text-yellow-700 bg-yellow-50 border-yellow-200",
      Approved: "text-green-600 bg-green-50 border-green-200",
      Completed: "text-gray-600 bg-gray-50 border-gray-200",
      Rejected: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your assigned tickets and service requests
          </p>
        </div>

        {/* Tickets Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Assigned Tickets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Assigned
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ticketStats.total}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {ticketStats.open}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {ticketStats.inProgress}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Resolved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {ticketStats.resolved}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Requests Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Assigned Service Requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Assigned
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {serviceRequestStats.total}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {serviceRequestStats.pending}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {serviceRequestStats.inProgress}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {serviceRequestStats.completed}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Tickets</CardTitle>
                <Link href="/agent/tickets">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTickets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tickets assigned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTickets.map((ticket) => (
                    <Link
                      key={ticket._id}
                      href={`/agent/tickets/${ticket._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {ticket.ticketId}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{ticket.category}</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Service Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Recent Service Requests
                </CardTitle>
                <Link href="/agent/service-requests">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No service requests assigned yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((request) => (
                    <Link
                      key={request._id}
                      href={`/agent/service-requests/${request._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {request.requestId}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {request.serviceType}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{request.category}</span>
                        <span>{formatDate(request.dateFrom)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
