import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const calculateFactors = (number) => {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
};

export const TopicsForm = ({
  courseData,
  setCourseData,
  onNext,
  onPrev,
  onCancel,
}) => {
  const availableTopicNumbers = calculateFactors(courseData.maxPoint);
  const [numberOfTopics, setNumberOfTopics] = useState(
    availableTopicNumbers[0]
  );

  useEffect(() => {
    if (courseData.topics.length === 0) {
      handleTopicNumberChange(availableTopicNumbers[0]);
    }
  }, [courseData.topics]);

  const handleTopicNumberChange = (value) => {
    const newTopicCount = value;
    setNumberOfTopics(newTopicCount);
    const topicMaxPoint = courseData.maxPoint / newTopicCount;
    const newTopics = Array(newTopicCount)
      .fill(null)
      .map((_, index) => ({
        topicName: courseData.topics[index]?.topicName || `Topic ${index + 1}`,
        maxPoint: topicMaxPoint,
        exercises: courseData.topics[index]?.exercises || [],
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Topics
        </label>
        <Select
          value={numberOfTopics}
          onChange={handleTopicNumberChange}
          className="w-full"
        >
          {availableTopicNumbers.map((num) => (
            <Option key={num} value={num}>
              {num} Topics (Each: {courseData.maxPoint / num} points)
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
            placeholder={`Topic ${index + 1} Name`}
          />
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onPrev}>Back</Button>
        <Button type="primary" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};
