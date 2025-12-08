"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { adminService } from "@/services/adminService";
import { useToast } from "@/hooks/useToast";
import {
  Settings,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Folder,
  Tag,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Hardware",
    subcategories: "",
  });

  useEffect(() => {
    loadCategories();
  }, [typeFilter]);

  const loadCategories = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const response = await adminService.getCategories(
        typeFilter === "all" ? undefined : typeFilter
      );
      setCategories(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      type: "Hardware",
      subcategories: "",
    });
    setShowDialog(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      subcategories: category.subcategories?.join(", ") || "",
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      const subcategoriesArray = formData.subcategories
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const data = {
        name: formData.name,
        type: formData.type,
        subcategories: subcategoriesArray,
      };

      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, data);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await adminService.createCategory(data);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      setShowDialog(false);
      loadCategories(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      await adminService.deleteCategory(categoryId);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadCategories(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">
              Manage ticket and service request categories
            </p>
          </div>
          <Button onClick={handleCreateCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCategories(true)}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Card key={category._id} className="border">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">
                            {category.name}
                          </h3>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {category.type}
                        </span>
                      </div>

                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-600 mb-2">
                              Subcategories:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.map(
                                (sub: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full flex items-center gap-1"
                                  >
                                    <Tag className="h-3 w-3" />
                                    {sub}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div className="flex items-center gap-2 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteCategory(category._id, category.name)
                          }
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Categories Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first category to get started
                  </p>
                  <Button onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Category Dialog */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Category Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Laptop, Printer, Database"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Subcategories
                  </label>
                  <Input
                    value={formData.subcategories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subcategories: e.target.value,
                      })
                    }
                    placeholder="Enter subcategories separated by commas"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: Display Issue, Keyboard Problem, Battery
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting
                      ? "Saving..."
                      : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                  </Button>
                </div>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
