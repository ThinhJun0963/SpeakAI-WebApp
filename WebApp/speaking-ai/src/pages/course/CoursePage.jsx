import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/axiosInstance";
import CourseList from "../../components/course/CourseList/CourseList";
import CreateCoursePage from "./CreateCoursePage";
import { Button, Spin } from "antd";

const CoursePage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseApi.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseCreated = () => {
    setIsCreating(false);
    fetchCourses();
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <Button type="primary" onClick={() => setIsCreating(true)}>
          Create Course
        </Button>
      </div>
      {isCreating ? (
        <CreateCoursePage
          onComplete={handleCourseCreated}
          onCancel={handleCancel}
        />
      ) : loading ? (
        <Spin tip="Loading courses..." />
      ) : (
        <CourseList courses={courses} onRefresh={fetchCourses} />
      )}
    </div>
  );
};

export default CoursePage;
