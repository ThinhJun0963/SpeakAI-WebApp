import React from "react";
import CourseCard from "./CourseCard";
import { Card, Spin, Empty } from "antd";

const CourseList = ({ courses, onRefresh }) => {
  if (!Array.isArray(courses)) {
    return (
      <Spin
        tip="Loading courses..."
        className="w-full flex justify-center py-10"
      />
    );
  }

  if (courses.length === 0) {
    return <Empty description="No courses available" className="py-10" />;
  }

  return (
    <Card
      title="Course List"
      extra={
        <button
          onClick={onRefresh}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Refresh
        </button>
      }
      className="shadow-lg rounded-xl"
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
