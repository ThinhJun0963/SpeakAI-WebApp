import React from "react";
import { courseService } from "../../../services/courseService";

const CourseCard = ({ course, onRefresh }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.delete(course.id);
        onRefresh();
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{course.courseName}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Level:</span>
          <span className="font-medium">{course.levelId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Max Points:</span>
          <span className="font-medium">{course.maxPoint}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Topics:</span>
          <span className="font-medium">{course.topics?.length || 0}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded text-sm ${
            course.isFree
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {course.isFree ? "Free" : "Paid"}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => {
              /* Handle edit */
            }}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
