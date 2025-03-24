import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

// Hàm tính các ước số của một số
const calculateFactors = (number) => {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
};

export const TopicsForm = ({ courseData, setCourseData, onNext, onPrev }) => {
  const availableTopicNumbers = calculateFactors(courseData.maxPoint);
  const [numberOfTopics, setNumberOfTopics] = useState(
    availableTopicNumbers[0]
  ); // Mặc định chọn tùy chọn đầu tiên

  useEffect(() => {
    // Khởi tạo topics nếu chưa có
    if (courseData.topics.length === 0) {
      handleTopicNumberChange(availableTopicNumbers[0]);
    }
  }, [courseData.topics]);

  const handleTopicNumberChange = (value) => {
    const newTopicCount = value;
    setNumberOfTopics(newTopicCount);
    const topicMaxPoint = courseData.maxPoint / newTopicCount; // Chia đều điểm
    const newTopics = Array(newTopicCount)
      .fill(null)
      .map((_, index) => ({
        topicName: `Chủ đề ${index + 1}`,
        maxPoint: topicMaxPoint,
        exercises: [],
      }));
    setCourseData((prev) => ({ ...prev, topics: newTopics }));
  };

  const handleTopicNameChange = (index, newName) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[index] = { ...updatedTopics[index], topicName: newName };
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Số lượng chủ đề
        </label>
        <Select
          value={numberOfTopics}
          onChange={handleTopicNumberChange}
          className="w-full rounded-md"
        >
          {availableTopicNumbers.map((num) => (
            <Option key={num} value={num}>
              {num} Chủ đề (Mỗi chủ đề: {courseData.maxPoint / num} điểm)
            </Option>
          ))}
        </Select>
      </div>
      <div className="space-y-4">
        {courseData.topics.map((topic, index) => (
          <Input
            key={index}
            value={topic.topicName}
            onChange={(e) => handleTopicNameChange(index, e.target.value)}
            placeholder={`Tên chủ đề ${index + 1}`}
            className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          onClick={onPrev}
          className="rounded-md border-gray-300 hover:bg-gray-100"
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={courseData.topics.some((t) => !t.topicName)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
};
