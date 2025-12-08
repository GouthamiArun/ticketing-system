import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketIcon, Wrench, Users, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TicketIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">IT Support</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Internal IT Ticketing System
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your IT support requests and complaints. Get help from
            our dedicated support team quickly and efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                  <TicketIcon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">Create Tickets</CardTitle>
                <CardDescription>
                  Submit hardware or software complaints with detailed
                  descriptions and priority levels.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-600">
                  Service Requests
                </CardTitle>
                <CardDescription>
                  Request IT assistance for trainings, workshops, and events
                  with equipment setup.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">
                  Track Progress
                </CardTitle>
                <CardDescription>
                  Monitor ticket status, receive updates, and communicate with
                  support agents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-gray-200 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Support Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  Fast
                </div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600">Satisfaction Goal</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  Track
                </div>
                <div className="text-gray-600">All Requests</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2024 IT Ticketing System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
