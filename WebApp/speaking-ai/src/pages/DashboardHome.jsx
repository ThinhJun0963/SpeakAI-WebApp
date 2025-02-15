import React from "react";
import StatCards from "../components/dashboard/StatCards";
import LearningCharts from "../components/dashboard/BookingCharts";
import ActivityTable from "../components/dashboard/ActivityTable";
import QuickActionCards from "../components/dashboard/QuickActionCards";
import { userStats, recentActivity } from "../data/dashboardData";
const DashboardPage = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* Page title */}
      <PageTitle
        title="Dashboard Overview"
        subtitle="Monitor and manage your Talk AI application performance"
      />

      {/* Stats cards */}
      <StatCards userStats={userStats} />

      <LearningCharts />
      {/* Recent activity */}
      <ActivityTable recentActivity={recentActivity} />

      {/* Quick access links */}
      <QuickActionCards />
    </main>
  );
};

// Page Title Component
const PageTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
    <p className="text-gray-600">{subtitle}</p>
  </div>
);
export default DashboardPage;
