// src/components/course/CourseForm.jsx
import React from "react";
import { Button, Input, Select, Checkbox } from "antd";

const { Option } = Select;

const POINT_OPTIONS = [
  { value: 90, label: "90 points" },
  { value: 100, label: "100 points" },
  { value: 200, label: "200 points" },
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Name
        </label>
        <Input
          value={courseData.courseName}
          onChange={(e) => handleFieldChange("courseName", e.target.value)}
          placeholder="Enter course name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Input
          value={courseData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Enter course description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Points
        </label>
        <Select
          value={courseData.maxPoint}
          onChange={(value) => handleFieldChange("maxPoint", value)}
          placeholder="Select maximum points"
          style={{ width: "100%" }}
        >
          {POINT_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Level
        </label>
        <Select
          value={courseData.levelId}
          onChange={(value) => handleFieldChange("levelId", value)}
          placeholder="Select course level"
          style={{ width: "100%" }}
        >
          {LEVEL_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex space-x-4">
        <Checkbox
          checked={courseData.isFree}
          onChange={(e) => handleFieldChange("isFree", e.target.checked)}
        >
          Free
        </Checkbox>
        <Checkbox
          checked={courseData.isPremium}
          onChange={(e) => handleFieldChange("isPremium", e.target.checked)}
        >
          Premium
        </Checkbox>
      </div>
      <div className="flex justify-between pt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={!courseData.courseName || !courseData.description}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
