"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ticketService } from "@/services/ticketService";
import { serviceRequestService } from "@/services/serviceRequestService";
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Wrench,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [ticketStats, requestStats] = await Promise.all([
        ticketService.getStats(),
        serviceRequestService.getStats(),
      ]);

      setStats({
        tickets: ticketStats.data,
        requests: requestStats.data,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage tickets, service requests, and system settings
          </p>
        </div>

        {/* Ticket Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ticket Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.tickets?.total || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <Ticket className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Open Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats?.tickets?.open || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Needs attention
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.tickets?.inProgress || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Being worked on
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.tickets?.resolved || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Request Stats */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Service Request Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats?.requests?.total || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats?.requests?.pending || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Awaiting review
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.requests?.approved || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ready to assign
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-red-600">
                      {stats?.requests?.rejected || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Declined</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/admin/tickets")}
                className="h-24 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <Ticket className="h-6 w-6" />
                <span>Manage All Tickets</span>
              </Button>
              <Button
                onClick={() => router.push("/admin/service-requests")}
                className="h-24 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <FileText className="h-6 w-6" />
                <span>Manage Service Requests</span>
              </Button>
              <Button
                onClick={() => router.push("/admin/users")}
                className="h-24 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <Users className="h-6 w-6" />
                <span>User Management</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
