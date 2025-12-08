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
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
  XCircle,
  CalendarRange,
  Timer,
  Wrench,
} from "lucide-react";

export default function AgentServiceRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const requestId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (requestId) {
      loadRequest();
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
      router.push("/agent/service-requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        status: newStatus,
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

  const handleApprove = async () => {
    try {
      setUpdatingStatus(true);
      await serviceRequestService.approveServiceRequest(requestId);
      toast({
        title: "Success",
        description: "Service request approved",
      });
      loadRequest(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve service request",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    try {
      setUpdatingStatus(true);
      await serviceRequestService.rejectServiceRequest(requestId);
      toast({
        title: "Success",
        description: "Service request rejected",
      });
      loadRequest(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject service request",
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
          <Link href="/agent/service-requests">
            <Button className="mt-4">Back to Service Requests</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-10rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/agent/service-requests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {request.requestId}
                <span
                  className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {request.serviceType}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Main Content - Conversation */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardContent className="p-6 flex-1 flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                  {/* Initial Request */}
                  <div className="flex justify-start">
                    <div className="max-w-[75%]">
                      <div className="flex items-center gap-2 mb-1 justify-start">
                        <span className="text-xs font-medium text-gray-700">
                          {request.createdBy?.name || "Unknown"}
                          <span className="ml-1 text-gray-500">(Employee)</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(request.createdAt)}
                        </span>
                      </div>
                      <div className="rounded-lg p-3 bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow-sm">
                        <p className="text-sm whitespace-pre-wrap">
                          {request.description}
                        </p>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            <span className="font-medium">Type:</span>
                            <span>{request.typeOfService}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarRange className="h-4 w-4" />
                            <span className="font-medium">Dates:</span>
                            <span>
                              {formatDate(request.dateFrom)} -{" "}
                              {formatDate(request.dateTo)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span className="font-medium">Duration:</span>
                            <span>{request.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {request.comments?.map((comment: any, index: number) => {
                    const isEmployee =
                      comment.user?.role?.toLowerCase() === "employee";
                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isEmployee ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div className="max-w-[75%]">
                          <div
                            className={`flex items-center gap-2 mb-1 ${
                              isEmployee ? "justify-start" : "justify-end"
                            }`}
                          >
                            <span className="text-xs font-medium text-gray-700">
                              {comment.user?.name || "Unknown User"}
                              {comment.user?.role && (
                                <span className="ml-1 text-gray-500">
                                  ({comment.user.role})
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              isEmployee
                                ? "bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow-sm"
                                : "bg-green-500 text-white rounded-tr-none"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 resize-none"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={submitting || !message.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Request Details & Actions */}
          <div className="space-y-4 overflow-y-auto">
            {/* Actions Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  {request.status === "Pending" && (
                    <>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleApprove}
                        disabled={updatingStatus}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Request
                      </Button>
                      <Button
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        variant="outline"
                        onClick={handleReject}
                        disabled={updatingStatus}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </Button>
                    </>
                  )}

                  {request.status === "Approved" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate("In Progress")}
                      disabled={updatingStatus}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Working
                    </Button>
                  )}

                  {request.status === "In Progress" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate("Completed")}
                      disabled={updatingStatus}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Request Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Priority</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                  {request.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Assigned To</span>
                      <span className="text-sm text-gray-900">
                        {request.assignedTo.name}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Service Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Service Type:</span>
                    <p className="text-gray-900 font-medium">
                      {request.serviceType}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type of Service:</span>
                    <p className="text-gray-900 font-medium">
                      {request.typeOfService}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="text-gray-900 font-medium">{request.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="text-gray-900 font-medium">
                      {request.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Subcategory:</span>
                    <p className="text-gray-900 font-medium">
                      {request.subcategory}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Schedule */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Event Schedule
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <p className="text-gray-900 font-medium">
                      {formatDate(request.dateFrom)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="text-gray-900 font-medium">
                      {formatDate(request.dateTo)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="text-gray-900 font-medium">
                      {request.duration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requester Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Requester
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="text-gray-900 font-medium">
                      {request.createdBy?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="text-gray-900">
                      {request.createdBy?.email || "N/A"}
                    </p>
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
