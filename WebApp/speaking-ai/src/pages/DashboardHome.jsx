import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCards from "../components/dashboard/StatCards";
import LearningCharts from "../components/dashboard/BookingCharts";
import ActivityTable from "../components/dashboard/ActivityTable";
import QuickActionCards from "../components/dashboard/QuickActionCards";
import { courseApi } from "../api/axiosInstance";
import { Loader2 } from "lucide-react";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all courses
        const coursesResponse = await courseApi.getAll();
        const courses = coursesResponse || [];

        // Calculate various statistics
        const totalCourses = courses.length;
        const activeCourses = courses.filter((c) => c.isActive).length;
        const premiumCourses = courses.filter((c) => c.isPremium).length;
        const avgMaxPoint =
          courses.length > 0
            ? (
                courses.reduce((sum, c) => sum + c.maxPoint, 0) / courses.length
              ).toFixed(1)
            : 0;
        const coursesByLevel = courses.reduce((acc, c) => {
          acc[c.levelId] = (acc[c.levelId] || 0) + 1;
          return acc;
        }, {});

        // Define stats
        const statsData = [
          {
            title: "Total Courses",
            value: totalCourses,
            change: courses.length > 0 ? "+1" : "0",
            borderColor: "border-blue-200",
            bgColor: "bg-blue-500",
            icon: "BookOpen",
            iconColor: "text-white",
          },
          {
            title: "Active Courses",
            value: activeCourses,
            change:
              activeCourses > 0 ? `+${Math.round(activeCourses / 2)}` : "0",
            borderColor: "border-green-200",
            bgColor: "bg-green-500",
            icon: "CheckCircle",
            iconColor: "text-white",
          },
          {
            title: "Premium Courses",
            value: premiumCourses,
            change:
              premiumCourses > 0 ? `+${Math.round(premiumCourses / 3)}` : "0",
            borderColor: "border-purple-200",
            bgColor: "bg-purple-500",
            icon: "Star",
            iconColor: "text-white",
          },
          {
            title: "Average Max Points",
            value: avgMaxPoint,
            change: avgMaxPoint > 0 ? "+10" : "0",
            borderColor: "border-orange-200",
            bgColor: "bg-orange-500",
            icon: "TrendingUp",
            iconColor: "text-white",
          },
        ];

        // Fetch detailed data for recent activity (top 5 courses)
        const detailedCourses = await Promise.all(
          courses
            .slice(0, 5)
            .map((course) => courseApi.getDetails(course.id).catch(() => null))
        );

        const recentActivityData = detailedCourses
          .filter((course) => course !== null)
          .flatMap((course) =>
            (course.topics || []).map((topic) => ({
              id: topic.id,
              courseName: course.courseName,
              action: "Topic Updated",
              scenario: topic.topicName,
              time: course.updatedAt
                ? new Date(course.updatedAt).toLocaleTimeString()
                : "Unknown",
              status: topic.isActive ? "Active" : "Inactive",
            }))
          );

        setStats(statsData);
        setActivity(recentActivityData);
        setCourseData(courses);
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      <PageTitle
        title="Course Management Dashboard"
        subtitle="Monitor and analyze your course ecosystem"
      />

      {stats && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatCards userStats={stats} />
        </motion.div>
      )}

      {courseData.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LearningCharts courses={courseData} />
        </motion.div>
      )}

      {activity.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <ActivityTable recentActivity={activity} />
        </motion.div>
      )}

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
