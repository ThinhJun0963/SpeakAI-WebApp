import React from "react";
import { motion } from "framer-motion";
import useDashboardData from "../hooks/useDashboardData";
import StatCards from "../components/dashboard/StatCards";
import LearningCharts from "../components/dashboard/LearningCharts";
import ActivityTable from "../components/dashboard/ActivityTable";
import QuickActionCards from "../components/dashboard/QuickActionCards";
import PageTitle from "../components/dashboard/PageTitle";
import {
  StatCardsSkeleton,
  LearningChartsSkeleton,
  ActivityTableSkeleton,
  QuickActionCardsSkeleton,
} from "../components/dashboard/DashboardSkeletons";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const DashboardHome = () => {
  const { stats, activity, courseData, voucherData, loading, error } =
    useDashboardData();

  if (error) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8 text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.main
      className="container mx-auto px-4 py-8 space-y-8 max-w-7xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <PageTitle
          title="Course Management Dashboard"
          subtitle="Monitor and analyze your course ecosystem"
        />
      </motion.div>

      <motion.div variants={childVariants}>
        {loading ? (
          <StatCardsSkeleton />
        ) : (
          <StatCards courses={courseData} vouchers={voucherData} />
        )}
      </motion.div>

      <motion.div variants={childVariants}>
        {loading ? (
          <LearningChartsSkeleton />
        ) : courseData.length > 0 ? (
          <LearningCharts courses={courseData} />
        ) : (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
            No course data available.
          </div>
        )}
      </motion.div>

      <motion.div variants={childVariants}>
        {loading ? (
          <ActivityTableSkeleton />
        ) : activity.length > 0 ? (
          <ActivityTable recentActivity={activity} />
        ) : (
          <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
            No recent activity available.
          </div>
        )}
      </motion.div>

      <motion.div variants={childVariants}>
        {loading ? <QuickActionCardsSkeleton /> : <QuickActionCards />}
      </motion.div>
    </motion.main>
  );
};

export default DashboardHome;
