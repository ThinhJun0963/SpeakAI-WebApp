import React from "react";
import BookingStats from "../components/dashboard/BookingStats";
import BookingCharts from "../components/dashboard/BookingCharts";
import RecentBookings from "../components/dashboard/RecentBookings";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <BookingStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookingCharts />
        <RecentBookings />
      </div>
    </div>
  );
};

export default DashboardHome;
