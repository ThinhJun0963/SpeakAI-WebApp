// src/components/course/TopicsForm.jsx
import React, { useState } from "react";
import { Button, Input, Select } from "antd";
import { calculateFactors } from "../../utils/calculations";

const { Option } = Select;

export const TopicsForm = ({ courseData, setCourseData, onNext, onPrev }) => {
  const [numberOfTopics, setNumberOfTopics] = useState(1);
  const availableTopicNumbers = calculateFactors(courseData.maxPoint);

  const handleTopicNumberChange = (value) => {
    const newTopicCount = value;
    setNumberOfTopics(newTopicCount);
    const newTopics = Array(newTopicCount)
      .fill(null)
      .map((_, index) => ({
        topicName: `Topic ${index + 1}`,
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Topics
        </label>
        <Select
          value={numberOfTopics}
          onChange={handleTopicNumberChange}
          style={{ width: "100%" }}
        >
          {availableTopicNumbers.map((num) => (
            <Option key={num} value={num}>
              {num} Topics
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
      <div className="flex justify-between">
        <Button onClick={onPrev}>Previous</Button>
        <Button
          type="primary"
          onClick={onNext}
          disabled={courseData.topics.some((t) => !t.topicName)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
