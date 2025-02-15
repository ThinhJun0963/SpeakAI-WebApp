import React from "react";
import Select from "../ui/Select";

const POINT_OPTIONS = [
  { value: 90, label: "100 points" },
  { value: 100, label: "200 points" },
  { value: 200, label: "300 points" },
  { value: 300, label: "400 points" },
];

const LEVEL_OPTIONS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

export const CourseForm = ({ courseData, setCourseData, onNext, onCancel }) => {
  const handleFieldChange = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <form className="space-y-6">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            placeholder="Enter course name"
            value={courseData.courseName}
            onChange={(e) => handleFieldChange("courseName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Enter course description"
            value={courseData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Maximum Points */}
        <Select
          label="Maximum Points"
          value={courseData.maxPoint}
          onChange={(e) =>
            handleFieldChange("maxPoint", parseInt(e.target.value))
          }
          options={POINT_OPTIONS}
          placeholder="Select maximum points"
        />

        {/* Course Level */}
        <Select
          label="Course Level"
          value={courseData.levelId}
          onChange={(e) =>
            handleFieldChange("levelId", parseInt(e.target.value))
          }
          options={LEVEL_OPTIONS}
          placeholder="Select course level"
        />

        {/* Course Type Toggles */}
        <div className="flex items-center justify-between space-x-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Free Course
            </label>
            <input
              type="checkbox"
              checked={courseData.isFree}
              onChange={(e) => {
                handleFieldChange("isFree", e.target.checked);
                handleFieldChange("isPremium", !e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Premium Course
            </label>
            <input
              type="checkbox"
              checked={courseData.isPremium}
              onChange={(e) => {
                handleFieldChange("isPremium", e.target.checked);
                handleFieldChange("isFree", !e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!courseData.courseName || !courseData.description}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
