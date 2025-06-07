import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";
import { calculateFactors } from "../../utils/helpers";

const { Option } = Select;

const TopicsForm = ({
  courseData,
  setCourseData,
  onNext,
  onPrev,
  onCancel,
}) => {
  const [numberOfTopics, setNumberOfTopics] = useState(
    calculateFactors(courseData.maxPoint)[0]
  );

  useEffect(() => {
    if (courseData.topics.length === 0)
      handleTopicNumberChange(calculateFactors(courseData.maxPoint)[0]);
  }, [courseData.topics]);

  const handleTopicNumberChange = (value) => {
    setNumberOfTopics(value);
    const topicMaxPoint = courseData.maxPoint / value;
    setCourseData({
      ...courseData,
      topics: Array(value)
        .fill()
        .map((_, i) => ({
          topicName: courseData.topics[i]?.topicName || `Topic ${i + 1}`,
          maxPoint: topicMaxPoint,
          exercises: courseData.topics[i]?.exercises || [],
        })),
    });
  };

  const handleTopicNameChange = (index, newName) => {
    setCourseData({
      ...courseData,
      topics: courseData.topics.map((t, i) =>
        i === index ? { ...t, topicName: newName } : t
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Select
        value={numberOfTopics}
        onChange={handleTopicNumberChange}
        className="w-full"
      >
        {calculateFactors(courseData.maxPoint).map((num) => (
          <Option key={num} value={num}>
            {num} Topics (Each: {courseData.maxPoint / num} points)
          </Option>
        ))}
      </Select>
      <div className="space-y-4">
        {courseData.topics.map((t, i) => (
          <Input
            key={i}
            value={t.topicName}
            onChange={(e) => handleTopicNameChange(i, e.target.value)}
            placeholder={`Topic ${i + 1} Name`}
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

export default TopicsForm;
