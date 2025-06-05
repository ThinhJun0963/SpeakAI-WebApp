import React from "react";
import CourseCard from "./CourseCard";
import { Card, Spin, Alert, Empty, Button } from "antd";

const CourseList = ({ courses, onRefresh }) => {
  const [updatedCourseStatus, setUpdatedCourseStatus] = React.useState({});

  const handleCourseUpdate = (courseId, isFree) => {
    setUpdatedCourseStatus((prev) => ({
      ...prev,
      [courseId]: { isFree },
    }));
    onRefresh();
  };

  if (!Array.isArray(courses)) {
    return <Spin tip="Loading courses..." />;
  }

  if (courses.length === 0) {
    return <Empty description="No courses available" />;
  }

  return (
    <Card
      title="Course List"
      extra={
        <Button type="link" onClick={onRefresh}>
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
            onRefresh={onRefresh}
            onUpdate={handleCourseUpdate}
            updatedStatus={updatedCourseStatus[course.id]}
          />
        ))}
      </div>
    </Card>
  );
};

export default CourseList;
