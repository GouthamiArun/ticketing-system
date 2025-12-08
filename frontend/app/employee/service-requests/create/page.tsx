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
import { serviceRequestService } from "@/services/serviceRequestService";
import { categoryService } from "@/services/categoryService";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Plus, Calendar } from "lucide-react";

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "",
    dateFrom: "",
    dateTo: "",
    duration: "",
    typeOfService: "",
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
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.serviceType ||
      !formData.dateFrom ||
      !formData.dateTo ||
      !formData.duration ||
      !formData.typeOfService ||
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

    // Validate dates
    const dateFrom = new Date(formData.dateFrom);
    const dateTo = new Date(formData.dateTo);
    if (dateTo < dateFrom) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await serviceRequestService.createServiceRequest(formData);
      toast({
        title: "Success",
        description: "Service request created successfully",
      });
      router.push("/employee/service-requests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/employee/service-requests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Service Request
            </h1>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Service Request Details</CardTitle>
            <CardDescription>
              Fill in the details below for your IT assistance request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">
                  Service Type <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, serviceType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT assistance to trainings">
                      IT assistance to trainings
                    </SelectItem>
                    <SelectItem value="IT assistance to workshops">
                      IT assistance to workshops
                    </SelectItem>
                    <SelectItem value="IT assistance to Writeshops">
                      IT assistance to Writeshops
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">
                    Start Date <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="dateFrom"
                    value={formData.dateFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, dateFrom: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo">
                    End Date <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="date"
                    id="dateTo"
                    value={formData.dateTo}
                    onChange={(e) =>
                      setFormData({ ...formData, dateTo: e.target.value })
                    }
                    min={
                      formData.dateFrom ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="text"
                  id="duration"
                  placeholder="e.g., 3 days, 2 hours"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>

              {/* Type of Service */}
              <div className="space-y-2">
                <Label htmlFor="typeOfService">
                  Type of Service <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.typeOfService}
                  onValueChange={(value) =>
                    setFormData({ ...formData, typeOfService: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment setup">
                      Equipment setup
                    </SelectItem>
                    <SelectItem value="Equipment and handholding">
                      Equipment and handholding
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type (Hardware/Software) */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Category Type <span className="text-red-600">*</span>
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
                  placeholder="Provide detailed information about your service request..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500">
                  Include event details, number of participants, specific
                  requirements, etc.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Service Request"}
                </Button>
                <Link href="/employee/service-requests" className="flex-1">
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
              Service Request Tips:
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Submit requests at least 3-5 days in advance</li>
              <li>Specify exact equipment needs and setup requirements</li>
              <li>Include participant count and venue details</li>
              <li>Mention any special technical requirements</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
