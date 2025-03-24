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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tên khóa học
        </label>
        <Input
          value={courseData.courseName}
          onChange={(e) => handleFieldChange("courseName", e.target.value)}
          placeholder="Nhập tên khóa học"
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mô tả
        </label>
        <Input
          value={courseData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Nhập mô tả khóa học"
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Điểm tối đa
        </label>
        <Select
          value={courseData.maxPoint}
          onChange={(value) => handleFieldChange("maxPoint", value)}
          placeholder="Chọn điểm tối đa"
          className="w-full rounded-md"
        >
          {POINT_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cấp độ
        </label>
        <Select
          value={courseData.levelId}
          onChange={(value) => handleFieldChange("levelId", value)}
          placeholder="Chọn cấp độ khóa học"
          className="w-full rounded-md"
        >
          {LEVEL_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <Checkbox
          checked={courseData.isPremium}
          onChange={(e) => handleFieldChange("isPremium", e.target.checked)}
          className="text-gray-700 dark:text-gray-300"
        >
          Premium
        </Checkbox>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          onClick={onCancel}
          className="rounded-md border-gray-300 hover:bg-gray-100"
        >
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={!courseData.courseName || !courseData.description}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
};
