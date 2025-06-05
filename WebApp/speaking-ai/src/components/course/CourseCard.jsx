import React, { useState } from "react";
import { Button, Card, Tag, Typography } from "antd";
import { courseApi } from "../../api/axiosInstance";
import CourseEditForm from "./CourseEditForm";

const { Text } = Typography;

const CourseCard = ({ course, onRefresh, onUpdate, updatedStatus }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseApi.delete(course.id);
        onRefresh();
      } catch (error) {
        alert("Failed to delete course.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleEditSuccess = (isFree) => {
    onUpdate(course.id, isFree);
    setEditModalVisible(false);
  };

  const levelMap = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  };

  const isFree =
    updatedStatus?.isFree !== undefined
      ? updatedStatus.isFree
      : course.isFree ?? true;
  const isPremium = course.isPremium ?? false;

  return (
    <>
      <Card
        title={course.courseName}
        hoverable
        style={{ width: "100%" }}
        extra={
          <div>
            {isFree && <Tag color="#52c41a">Free</Tag>}
            {isPremium && <Tag color="#faad14">Premium</Tag>}
          </div>
        }
      >
        <Text className="text-gray-600 mb-4 block">{course.description}</Text>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <Text className="text-gray-500">Level:</Text>
            <Text>{levelMap[course.levelId] || course.levelId}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Max Points:</Text>
            <Text>{course.maxPoint}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Status:</Text>
            <Text>{course.isActive ? "Active" : "Inactive"}</Text>
          </div>
          <div className="flex justify-between">
            <Text className="text-gray-500">Locked:</Text>
            <Text>{course.isLock ? "Yes" : "No"}</Text>
          </div>
          {course.topics && (
            <div className="flex justify-between">
              <Text className="text-gray-500">Topics:</Text>
              <Text>{course.topics.length}</Text>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center mt-4 pt-4 border-t">
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
