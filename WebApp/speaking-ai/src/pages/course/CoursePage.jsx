import React, { useState } from "react";
import CourseList from "../../components/course/CourseList/CourseList";
import { CourseCreationSteps } from "../../components/course/CourseCreationSteps";

const CoursePage = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCourseCreate = (courseData) => {
    console.log("Created course:", courseData);
    setIsCreating(false);
    // API call to create course here
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Course
        </button>
      </div>

      {isCreating ? (
        <CourseCreationSteps
          onComplete={handleCourseCreate}
          onCancel={() => setIsCreating(false)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <CourseList />
        </div>
      )}
    </div>
  );
};

export default CoursePage;
