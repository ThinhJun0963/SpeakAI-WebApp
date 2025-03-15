import React, { useState } from "react";
import CourseList from "../../components/course/CourseList/CourseList";
import CreateCoursePage from "./CreateCoursePage";
import { Button } from "antd";

const CoursePage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCourseCreated = () => {
    setIsCreating(false);
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
      ) : (
        <CourseList
          onRefresh={() => console.log("Refreshed from CoursePage")}
        />
      )}
    </div>
  );
};

export default CoursePage;
