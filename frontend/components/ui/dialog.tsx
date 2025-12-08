"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  const handleBackgroundClick = () => {
    // Only allow closing if onOpenChange is provided and not a no-op function
    if (onOpenChange && onOpenChange.toString() !== "() => {}") {
      onOpenChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleBackgroundClick}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({
  children,
  className = "",
}: DialogContentProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-xl w-[95vw] sm:w-[85vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-w-3xl mx-4 max-h-[90vh] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogBody({ children, className = "" }: DialogBodyProps) {
  return (
    <div className={`p-6 overflow-y-auto max-h-[calc(90vh-8rem)] ${className}`}>
      {children}
    </div>
  );
}
