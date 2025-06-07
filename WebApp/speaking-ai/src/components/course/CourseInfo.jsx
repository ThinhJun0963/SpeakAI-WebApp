import React from "react";
import { Tag } from "antd";
import { Skeleton } from "antd";

const CourseInfo = ({ course, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <p className="mb-2">
        <strong>Description:</strong> {course.description || "No description"}
      </p>
      <p className="mb-2">
        <strong>Max Point:</strong> {course.maxPoint || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Level:</strong>{" "}
        {["", "Beginner", "Intermediate", "Advanced"][course.levelId] ||
          "Undefined"}
      </p>
      <p className="mb-2">
        <strong>Status:</strong>{" "}
        <Tag color={course.isPremium ? "orange" : "green"}>
          {course.isPremium ? "Premium" : "Free"}
        </Tag>
      </p>
    </div>
  );
};

export default CourseInfo;
