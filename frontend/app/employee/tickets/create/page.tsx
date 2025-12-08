"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketService } from "@/services/ticketService";
import { categoryService } from "@/services/categoryService";
import { uploadService } from "@/services/uploadService";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Plus, Paperclip, X, File } from "lucide-react";

export default function CreateTicketPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    subcategory: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      console.log("Categories response:", response);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      category: "",
      subcategory: "",
    });
  };

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category,
      subcategory: "",
    });
  };

  const getFilteredCategories = () => {
    if (!formData.type) return [];
    return categories.filter((cat) => cat.type === formData.type);
  };

  const getSubcategories = () => {
    if (!formData.category) return [];
    const category = categories.find((cat) => cat.name === formData.category);
    return category?.subcategories || [];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.type ||
      !formData.category ||
      !formData.subcategory ||
      !formData.description
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

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
              "Failed to upload files, creating ticket without attachments",
            variant: "destructive",
          });
        }
        setUploadingFiles(false);
      }

      await ticketService.createTicket({
        ...formData,
        attachments: fileUrls,
      });

      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      router.push("/employee/tickets");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/employee/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Ticket</h1>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Fill in the details below to create a new ticket. Our support team
              will respond shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-600">*</span>
                </Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  disabled={!formData.type}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.type ? "Select type first" : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredCategories().length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        {!formData.type
                          ? "Please select a type first"
                          : "No categories available"}
                      </div>
                    ) : (
                      getFilteredCategories().map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label htmlFor="subcategory">
                  Subcategory <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subcategory: value })
                  }
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.category
                          ? "Select category first"
                          : "Select subcategory"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategories().length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        {!formData.category
                          ? "Please select a category first"
                          : "No subcategories available"}
                      </div>
                    ) : (
                      getSubcategories().map((subcat: string) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  Please provide as much detail as possible to help us resolve
                  your issue quickly.
                </p>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <div className="space-y-3">
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded text-sm"
                        >
                          <File className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-700 max-w-[200px] truncate">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
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
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={loading || uploadingFiles}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Add Attachments
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported: Images, PDFs, Word docs. Max 10MB per file.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || uploadingFiles}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {uploadingFiles
                    ? "Uploading files..."
                    : loading
                    ? "Creating..."
                    : "Create Ticket"}
                </Button>
                <Link href="/employee/tickets" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Tips for faster resolution:
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Provide clear and detailed descriptions</li>
              <li>Include error messages if applicable</li>
              <li>Mention steps to reproduce the issue</li>
              <li>Set appropriate priority based on urgency</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
