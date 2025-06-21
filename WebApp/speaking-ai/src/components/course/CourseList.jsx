import React from "react";
import { Card, Spin, Empty, Button } from "antd";
import CourseCard from "./CourseCard";

const CourseList = ({ courses, onRefresh }) => {
  if (!Array.isArray(courses)) return <Spin tip="Loading courses..." />;
  if (courses.length === 0) return <Empty description="No courses available" />;

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
          <CourseCard key={course.id} course={course} onRefresh={onRefresh} />
        ))}
      </div>
    </Card>
  );
};

export default CourseList;
