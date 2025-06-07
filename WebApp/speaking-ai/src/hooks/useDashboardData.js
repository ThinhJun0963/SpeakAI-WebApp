import { useState, useEffect } from "react";
import { courseApi, voucherApi } from "../api/axiosInstance";

const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
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
        setVoucherData(vouchers);
      } catch (err) {
        setError("Failed to load dashboard data: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return { stats, activity, courseData, voucherData, loading, error };
};

export default useDashboardData;
