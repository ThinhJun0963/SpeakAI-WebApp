// src/components/dashboard/QuickActionCards.jsx
import React from "react";
import StatCards from "./StatCards";
import { useDashboardData } from "../../hooks/useDashboardData";

const QuickActionCards = () => {
  const { courseData, voucherData, loading } = useDashboardData(); // Adjusted to match useDashboardData return values

  if (loading) return <div>Loading...</div>;
  if (!courseData || !voucherData) return <div>No data available</div>;

  return <StatCards courses={courseData} vouchers={voucherData} />;
};

export default QuickActionCards;
