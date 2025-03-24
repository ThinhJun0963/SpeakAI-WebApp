import React from "react";
import StatCards from "../components/dashboard/StatCards";
import LearningCharts from "../components/dashboard/BookingCharts";
import ActivityTable from "../components/dashboard/ActivityTable";
import QuickActionCards from "../components/dashboard/QuickActionCards";
import { motion } from "framer-motion";

// Dữ liệu mẫu (sẽ thay bằng API sau)
const userStats = [
  {
    title: "Total Courses",
    value: 25,
    change: "+5",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-500",
    icon: "BookOpen",
    iconColor: "text-white",
  },
  {
    title: "Active Users",
    value: 120,
    change: "+12",
    borderColor: "border-green-200",
    bgColor: "bg-green-500",
    icon: "Users",
    iconColor: "text-white",
  },
  {
    title: "Sessions Today",
    value: 45,
    change: "-3",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-500",
    icon: "BarChart2",
    iconColor: "text-white",
  },
  {
    title: "Revenue",
    value: "$1,250",
    change: "+$200",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-500",
    icon: "CreditCard",
    iconColor: "text-white",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Completed Lesson",
    scenario: "Basic Conversation",
    time: "2 hours ago",
    proficiency: "Intermediate",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Started Course",
    scenario: "Job Interview",
    time: "4 hours ago",
    proficiency: "Advanced",
  },
];

const DashboardHome = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <PageTitle
        title="Dashboard Overview"
        subtitle="Monitor and manage your SpeakAI application performance"
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StatCards userStats={userStats} />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <LearningCharts />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ActivityTable recentActivity={recentActivity} />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <QuickActionCards />
      </motion.div>
    </main>
  );
};

const PageTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
  </div>
);

export default DashboardHome;
