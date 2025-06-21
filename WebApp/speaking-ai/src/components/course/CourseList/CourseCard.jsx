// CourseCard.jsx
import React, { useState } from "react";
import { Button, Card, Tag, Typography } from "antd";
import { courseApi } from "../../../api/axiosInstance";

const { Text } = Typography;

const CourseCard = ({ course, onRefresh }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to delete "${course.courseName}"?`)
    ) {
      try {
        await courseApi.delete(course.id);
        onRefresh();
      } catch (error) {
        alert("Failed to delete course.");
        console.error("Delete error:", error);
      }
    }
  };

  const levelMap = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  };

  return (
    <Card
      hoverable
      className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
      cover={
        course.imageUrl && (
          <img
            alt={course.courseName}
            src={course.imageUrl}
            className="w-full h-48 object-cover"
          />
        )
      }
      actions={[
        <Button
          key="edit"
          type="link"
          onClick={() => setEditModalVisible(true)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit
        </Button>,
        <Button
          key="delete"
          onClick={handleDelete}
          className="bg-red-600 text-white hover:bg-red-700 font-medium rounded-xl px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Delete
        </Button>,
      ]}
    >
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {course.courseName}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <Text className="text-gray-500">Level</Text>
            <Text className="text-gray-800">
              {levelMap[course.levelId] || course.levelId}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Max Points</Text>
            <Text className="text-gray-800">{course.maxPoint}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Status</Text>
            <Tag color={course.isActive ? "green" : "red"}>
              {course.isActive ? "Active" : "Inactive"}
            </Tag>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Premium</Text>
            <Tag color={course.isPremium ? "orange" : "green"}>
              {course.isPremium ? "Yes" : "No"}
            </Tag>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
