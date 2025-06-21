import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "antd";
import StatCards from "../components/dashboard/StatCards";
import LearningCharts from "../components/dashboard/LearningCharts";
import ActivityTable from "../components/dashboard/ActivityTable";
import QuickActionCards from "../components/dashboard/QuickActionCards";
import { courseApi, voucherApi } from "../api/axiosInstance";

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const StatCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <Skeleton
        key={index}
        active
        avatar={{ shape: "square", size: "large" }}
        paragraph={false}
        title={{ width: "60%" }}
        className="p-4 bg-white rounded-lg shadow"
      />
    ))}
  </div>
);

const LearningChartsSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <Skeleton active title={false} paragraph={{ rows: 4 }} />
  </div>
);

const ActivityTableSkeleton = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <Skeleton active title={false} paragraph={{ rows: 5 }} />
  </div>
);

const QuickActionCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <Skeleton
        key={index}
        active
        avatar={{ shape: "square", size: "large" }}
        paragraph={false}
        title={{ width: "80%" }}
        className="p-4 bg-white rounded-lg shadow"
      />
    ))}
  </div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [voucherData, setVoucherData] = useState([]); // Thêm state cho vouchers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Gọi cả courseApi và voucherApi cùng lúc
        const [coursesResponse, vouchersResponse] = await Promise.all([
          courseApi.getAll(),
          voucherApi.getAll(),
        ]);

        const courses = coursesResponse?.result || coursesResponse || [];
        const vouchers = vouchersResponse?.result || vouchersResponse || [];

        const totalCourses = courses.length;
        const activeCourses = courses.filter((c) => c.isActive).length;
        const premiumCourses = courses.filter((c) => c.isPremium).length;
        const avgMaxPoint =
          courses.length > 0
            ? (
                courses.reduce((sum, c) => sum + c.maxPoint, 0) / courses.length
              ).toFixed(1)
            : 0;

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
        setVoucherData(vouchers); // Lưu dữ liệu vouchers
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

const PageTitle = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
      {title}
    </h1>
    <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
  </div>
);

export default DashboardHome;
