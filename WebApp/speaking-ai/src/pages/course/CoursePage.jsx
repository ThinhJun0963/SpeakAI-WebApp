// src/pages/CoursePage.jsx
import React, { useState } from "react";
import CourseList from "../../components/course/CourseList/CourseList";
import { CourseCreationSteps } from "../../components/course/CourseCreationSteps";
import { Button } from "antd";

const CoursePage = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <Button type="primary" onClick={() => setIsCreating(true)}>
          Create Course
        </Button>
      </div>
      {isCreating ? (
        <CourseCreationSteps
          onComplete={() => setIsCreating(false)}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <CourseList />
      )}
    </div>
  );
};

export default CoursePage;
