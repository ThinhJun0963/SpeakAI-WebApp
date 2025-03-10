import React, { useState } from "react";
import { Button, Card } from "antd";
import { courseApi } from "../../../api/axiosInstance";
import CourseEditForm from "../CourseEditForm";

const CourseCard = ({ course, onRefresh }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseApi.delete(course.id);
        onRefresh();
      } catch (error) {
        alert("Failed to delete course.");
      }
    }
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    onRefresh();
  };

  return (
    <>
      <Card title={course.courseName} hoverable style={{ width: "100%" }}>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Level:</span>
            <span>{course.levelId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Max Points:</span>
            <span>{course.maxPoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span>{course.isActive ? "Active" : "Inactive"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Locked:</span>
            <span>{course.isLock ? "Yes" : "No"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <span
            className={`px-2 py-1 rounded text-sm ${
              course.isFree
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {course.isFree ? "Free" : "Premium"}
          </span>
          <div className="space-x-2">
            <Button size="small" onClick={() => setEditModalVisible(true)}>
              Edit
            </Button>
            <Button danger size="small" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <CourseEditForm
        course={course}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default CourseCard;
