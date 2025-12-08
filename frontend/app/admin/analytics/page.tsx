"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/useToast";
import { BarChart3, Users, Ticket, Wrench, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await adminService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              View system analytics and reports
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.users?.total || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Employees: {analytics?.users?.employees || 0} | Agents:{" "}
                {analytics?.users?.agents || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tickets
              </CardTitle>
              <Ticket className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.tickets?.total || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">All support tickets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Service Requests
              </CardTitle>
              <Wrench className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.serviceRequests?.total || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">All service requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.users?.admins || 0}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tickets by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.tickets?.byStatus &&
            analytics.tickets.byStatus.length > 0 ? (
              <div className="space-y-4">
                {analytics.tickets.byStatus.map((stat: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stat._id === "Open"
                            ? "bg-blue-500"
                            : stat._id === "In Progress"
                            ? "bg-orange-500"
                            : stat._id === "Resolved"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">{stat._id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{stat.count}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stat._id === "Open"
                              ? "bg-blue-500"
                              : stat._id === "In Progress"
                              ? "bg-orange-500"
                              : stat._id === "Resolved"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                          style={{
                            width: `${
                              (stat.count / analytics.tickets.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No ticket data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Service Requests by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Service Requests by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.serviceRequests?.byStatus &&
            analytics.serviceRequests.byStatus.length > 0 ? (
              <div className="space-y-4">
                {analytics.serviceRequests.byStatus.map(
                  (stat: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            stat._id === "Pending"
                              ? "bg-yellow-500"
                              : stat._id === "Approved"
                              ? "bg-green-500"
                              : stat._id === "In Progress"
                              ? "bg-blue-500"
                              : stat._id === "Completed"
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm font-medium">{stat._id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">{stat.count}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              stat._id === "Pending"
                                ? "bg-yellow-500"
                                : stat._id === "Approved"
                                ? "bg-green-500"
                                : stat._id === "In Progress"
                                ? "bg-blue-500"
                                : stat._id === "Completed"
                                ? "bg-gray-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                (stat.count / analytics.serviceRequests.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No service request data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
