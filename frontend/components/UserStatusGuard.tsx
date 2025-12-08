"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface UserStatusGuardProps {
  children: React.ReactNode;
}

export default function UserStatusGuard({ children }: UserStatusGuardProps) {
  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Check user status immediately
    checkUserStatus();

    // Set up interval to check user status every 30 seconds
    const interval = setInterval(() => {
      checkUserStatus();
    }, 30000); // 30 seconds

    setCheckInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const checkUserStatus = async () => {
    try {
      await authService.getMe();
      // If successful, user is active
      setIsBlocked(false);
    } catch (error: any) {
      // Check if error is due to inactive account
      if (
        error.code === "ACCOUNT_INACTIVE" ||
        error.message?.includes("deactivated") ||
        error.message?.includes("inactive")
      ) {
        setIsBlocked(true);
        // Clear the check interval
        if (checkInterval) {
          clearInterval(checkInterval);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      router.push("/login");
    }
  };

  return (
    <>
      {children}

      {/* Blocking Modal for Inactive Account */}
      <Dialog open={isBlocked} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              Account Blocked
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                Your account has been deactivated by the administrator.
                <br />
                You cannot perform any actions until your account is
                reactivated.
              </p>
              <p className="text-sm text-gray-500 text-center">
                Please contact your system administrator for assistance.
              </p>
              <div className="flex justify-center pt-2">
                <Button onClick={handleLogout} variant="destructive" size="lg">
                  Return to Login
                </Button>
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
