"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { FilePreview } from "@/components/FilePreview";
import { ticketService } from "@/services/ticketService";
import { uploadService } from "@/services/uploadService";
import { useToast } from "@/hooks/useToast";
import { getFileUrl, getFileName } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  User,
  Calendar,
  Tag,
  AlertCircle,
  RefreshCw,
  Paperclip,
  File,
  X,
  Download,
  Eye,
  History,
} from "lucide-react";

export default function AgentTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const ticketId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.comments]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadTicket = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await ticketService.getTicket(ticketId);
      setTicket(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket details",
        variant: "destructive",
      });
      router.push("/agent/tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: "Error",
            description: `${file.name} is too large. Max size is 10MB.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      setAttachments([...attachments, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a message or attach files",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      let fileUrls: string[] = [];
      if (attachments.length > 0) {
        setUploadingFiles(true);
        try {
          const uploaded = await uploadService.uploadMultiple(attachments);
          fileUrls = uploaded.map((f) => f.url);
        } catch (error) {
          toast({
            title: "Warning",
            description:
              "Failed to upload files, sending message without attachments",
            variant: "destructive",
          });
        }
        setUploadingFiles(false);
      }

      await ticketService.addComment(ticketId, message, fileUrls);

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      setMessage("");
      setAttachments([]);
      loadTicket(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await ticketService.updateTicket(ticketId, { status: newStatus as any });
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
      loadTicket(true);
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

  const handleMarkResolved = async () => {
    try {
      setUpdatingStatus(true);
      await ticketService.markAsResolved(ticketId);
      toast({
        title: "Success",
        description: "Ticket marked as resolved",
      });
      loadTicket(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark ticket as resolved",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      Open: "bg-blue-100 text-blue-700 border-blue-200",
      "In Progress": "bg-orange-100 text-orange-700 border-orange-200",
      Resolved: "bg-green-100 text-green-700 border-green-200",
      Closed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      Low: "bg-gray-100 text-gray-700 border-gray-300",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      High: "bg-orange-100 text-orange-700 border-orange-300",
      Critical: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[priority] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Ticket not found</p>
          <Link href="/agent/tickets">
            <Button className="mt-4">Back to Tickets</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/agent/tickets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                {ticket.ticketId}
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {ticket.type} - {ticket.subcategory}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => loadTicket(true)}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setShowTimeline(true)}
              variant="outline"
              size="sm"
            >
              <History className="h-4 w-4 mr-2" />
              Timeline
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Ticket Description */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Original Request:
                </p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {ticket.description}
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Created on {formatDateTime(ticket.createdAt)}
                </p>
              </CardContent>
            </Card>

            {/* Conversation */}
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Conversation</h3>
                </div>

                {/* Messages - Fixed Height with Scroll */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map((comment: any, index: number) => {
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
                                {comment.user?.name || "Unknown"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-lg ${
                                isEmployee
                                  ? "bg-white text-gray-900 border border-gray-200"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {comment.text}
                              </p>
                              {comment.attachments &&
                                comment.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {comment.attachments.map(
                                      (att: string, i: number) => {
                                        const fileName = getFileName(att);
                                        return (
                                          <div
                                            key={i}
                                            className={`flex items-center gap-2 text-xs ${
                                              isEmployee
                                                ? "text-blue-600"
                                                : "text-blue-100"
                                            }`}
                                          >
                                            <File className="h-3 w-3" />
                                            <span className="max-w-[150px] truncate">
                                              {fileName}
                                            </span>
                                            <button
                                              onClick={() =>
                                                setPreviewFile(att)
                                              }
                                              className="hover:underline"
                                              title="Preview"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </button>
                                            <a
                                              href={getFileUrl(att)}
                                              download
                                              className="hover:underline"
                                              title="Download"
                                            >
                                              <Download className="h-3 w-3" />
                                            </a>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {ticket.status !== "Closed" && (
                  <div className="border-t border-gray-200 p-4 bg-white">
                    {attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded text-sm"
                          >
                            <File className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-700 max-w-[200px] truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="relative">
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                          disabled={submitting}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        className="resize-none flex-1"
                        disabled={submitting}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={
                          submitting ||
                          uploadingFiles ||
                          (!message.trim() && attachments.length === 0)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {submitting
                          ? "Sending..."
                          : uploadingFiles
                          ? "Uploading..."
                          : "Send"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift + Enter for new line
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Update Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">Actions</h3>
                {ticket.status === "Open" && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusUpdate("In Progress")}
                    disabled={updatingStatus}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Working
                  </Button>
                )}

                {ticket.status === "In Progress" && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkResolved}
                    disabled={updatingStatus}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}

                {ticket.status === "Resolved" && (
                  <div className="text-sm text-green-600 font-medium text-center py-2">
                    ✓ Ticket Resolved
                  </div>
                )}

                <div className="pt-2 border-t">
                  <label className="text-xs text-gray-600 mb-2 block">
                    Update Status:
                  </label>
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusUpdate}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Status</p>
                    <p className="font-medium text-gray-900">{ticket.status}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Priority</p>
                    <p className="font-medium text-gray-900">
                      {ticket.priority}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Created</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDateTime(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {formatDateTime(ticket.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requester Info */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-gray-600 mb-3">Requester</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {ticket.createdBy?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {ticket.createdBy?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent>
          <DialogHeader onClose={() => setShowTimeline(false)}>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Ticket Timeline
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            {ticket.timeline && ticket.timeline.length > 0 ? (
              <div className="space-y-4">
                {ticket.timeline.map((event: any, index: number) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {event.details}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.performedByName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {event.timestamp}
                      </p>
                      {(event.oldValue || event.newValue) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {event.oldValue && (
                            <span className="line-through">
                              {event.oldValue}
                            </span>
                          )}
                          {event.oldValue && event.newValue && " → "}
                          {event.newValue && (
                            <span className="font-medium text-gray-700">
                              {event.newValue}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No timeline events
              </p>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview url={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </DashboardLayout>
  );
}
