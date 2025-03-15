import React, { useEffect, useState } from "react";
import CourseCard from "../CourseList/CourseCard";
import useApi from "../../../components/hooks/useApi";
import { courseApi } from "../../../api/axiosInstance";
import { Card, Spin, Alert, Empty, Button } from "antd";

const CourseList = ({ onRefresh: parentOnRefresh }) => {
  const { data: courses, loading, error, execute } = useApi([]);
  const [updatedCourseStatus, setUpdatedCourseStatus] = useState({});

  useEffect(() => {
    fetchCourses();
  }, [execute]);

  const fetchCourses = async () => {
    try {
      await execute(courseApi.getAll);
      console.log("Courses fetched:", courses);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const handleRefresh = async () => {
    await fetchCourses();
    if (parentOnRefresh) parentOnRefresh();
  };

  const handleCourseUpdate = (courseId, isFree) => {
    setUpdatedCourseStatus((prev) => ({
      ...prev,
      [courseId]: { isFree },
    }));
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin size="large" tip="Loading courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="m-6"
        action={
          <Button size="small" danger onClick={handleRefresh}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <Empty
        className="py-10"
        description="No courses available"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Card
      title="Course List"
      extra={
        <Button type="link" onClick={handleRefresh}>
          Refresh
        </Button>
      }
      className="shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onRefresh={handleRefresh}
            onUpdate={handleCourseUpdate}
            updatedStatus={updatedCourseStatus[course.id]}
          />
        ))}
      </div>
    </Card>
  );
};

export default CourseList;
