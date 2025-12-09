"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceRequestService } from "@/services/serviceRequestService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  Clock,
  Send,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  CalendarRange,
  Timer,
  Wrench,
  UserCheck,
} from "lucide-react";

export default function AdminServiceRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const requestId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [request, setRequest] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadRequest();
      loadAgents();
    }
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [request?.comments]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadRequest = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await serviceRequestService.getServiceRequestById(
        requestId
      );
      setRequest(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service request details",
        variant: "destructive",
      });
      router.push("/admin/service-requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await userService.getAgents();
      setAgents(response.data || []);
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    try {
      setAssigning(true);
      await serviceRequestService.assignServiceRequest(requestId, agentId);
      toast({
        title: "Success",
        description: "Service request assigned successfully",
      });
      loadRequest(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign service request",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await serviceRequestService.addComment(requestId, message);

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setMessage("");
      loadRequest(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await serviceRequestService.updateServiceRequest(requestId, {
        status: newStatus as any,
      });
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
      loadRequest(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Pending: "text-yellow-700 bg-yellow-50 border-yellow-200",
      Approved: "text-green-600 bg-green-50 border-green-200",
      "In Progress": "text-blue-600 bg-blue-50 border-blue-200",
      Completed: "text-gray-600 bg-gray-50 border-gray-200",
      Rejected: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      Low: "text-gray-600 bg-gray-100 border-gray-300",
      Medium: "text-blue-600 bg-blue-100 border-blue-300",
      High: "text-orange-600 bg-orange-100 border-orange-300",
      Critical: "text-red-600 bg-red-100 border-red-300",
    };
    return colors[priority] || "text-gray-600 bg-gray-100 border-gray-300";
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
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

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Service request not found</p>
          <Link href="/admin/service-requests">
            <Button className="mt-4">Back to Service Requests</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isEmployee = (comment: any) => {
    return comment.createdBy?.role === "employee";
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/service-requests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                {request.requestId}
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                    request.priority
                  )}`}
                >
                  {request.priority}
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {request.serviceType}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadRequest(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Request Details */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </h3>
                    <p className="text-gray-900">{request.serviceType}</p>
                  </div>

                  {request.typeOfService && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Type of Service
                      </h3>
                      <p className="text-gray-900">{request.typeOfService}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {request.dateFrom && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <CalendarRange className="h-4 w-4" />
                          Date From
                        </h3>
                        <p className="text-gray-900">
                          {formatDate(request.dateFrom)}
                        </p>
                      </div>
                    )}
                    {request.dateTo && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <CalendarRange className="h-4 w-4" />
                          Date To
                        </h3>
                        <p className="text-gray-900">
                          {formatDate(request.dateTo)}
                        </p>
                      </div>
                    )}
                  </div>

                  {request.duration && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        Duration
                      </h3>
                      <p className="text-gray-900">{request.duration}</p>
                    </div>
                  )}

                  {request.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {request.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conversation */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Conversation
                </h3>
                <div className="space-y-4 mb-4 h-[400px] overflow-y-auto pr-2">
                  {request.comments && request.comments.length > 0 ? (
                    request.comments.map((comment: any, index: number) => {
                      const isEmp = isEmployee(comment);
                      return (
                        <div
                          key={index}
                          className={`flex ${
                            isEmp ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              isEmp ? "bg-gray-100" : "bg-blue-600 text-white"
                            } rounded-lg p-3`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-3 w-3" />
                              <span className="text-xs font-medium">
                                {comment.createdBy?.name}
                              </span>
                              <span
                                className={`text-xs ${
                                  isEmp ? "text-gray-500" : "text-blue-100"
                                }`}
                              >
                                {formatTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No comments yet</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="space-y-2 border-t pt-4">
                  <Textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendMessage}
                      disabled={submitting || !message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {submitting ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Assignment
                </h3>
                <div className="space-y-4">
                  {request.assignedTo && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">
                        Currently Assigned To
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {request.assignedTo.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {request.assignedTo.email}
                      </p>
                    </div>
                  )}
                  <Select
                    onValueChange={handleAssignAgent}
                    disabled={assigning}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent._id} value={agent._id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Update Status
                </h3>
                <Select
                  value={request.status}
                  onValueChange={handleStatusUpdate}
                  disabled={updatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Request Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Request Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="font-medium text-gray-900">
                        {request.createdBy?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Service Type</p>
                      <p className="font-medium text-gray-900">
                        {request.serviceType}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
