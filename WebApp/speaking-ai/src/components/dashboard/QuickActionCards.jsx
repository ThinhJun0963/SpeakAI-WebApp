import React from "react";
import { User, BookOpen, BarChart2 } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

const QuickActionCards = () => {
  return (
    <section className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="bg-blue-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add, update, or delete user accounts and monitor their activity
            </p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Access User Management →
            </button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="bg-green-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Update Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage lessons, scenarios, and practice exercises
            </p>
            <button className="text-sm font-medium text-green-600 hover:text-green-800">
              Edit Learning Content →
            </button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="bg-purple-50 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              View Reports
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Access detailed analytics and performance indicators
            </p>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-800">
              Generate Reports →
            </button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuickActionCards;
