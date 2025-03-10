// src/components/course/ExercisesForm.jsx
import React, { useState } from "react";
import { Button, Input, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  loading,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  const handleTopicChange = (value) => {
    setSelectedTopicIndex(value);
  };

  const selectedTopic =
    selectedTopicIndex !== null ? courseData.topics[selectedTopicIndex] : null;

  const handleExerciseContentChange = (index, newContent) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises[index] = {
      content: newContent,
    };
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  const addExercise = () => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises.push({ content: "" });
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Topic
        </label>
        <Select
          value={selectedTopicIndex}
          onChange={handleTopicChange}
          placeholder="Select a topic"
          style={{ width: "100%" }}
        >
          {courseData.topics.map((topic, index) => (
            <Option key={index} value={index}>
              {topic.topicName}
            </Option>
          ))}
        </Select>
      </div>
      {selectedTopic && (
        <div className="space-y-4">
          {selectedTopic.exercises.map((exercise, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise {index + 1}
              </label>
              <TextArea
                value={exercise.content}
                onChange={(e) =>
                  handleExerciseContentChange(index, e.target.value)
                }
                placeholder={`Enter content for Exercise ${index + 1}`}
                rows={4}
              />
            </div>
          ))}
          <Button onClick={addExercise}>Add Exercise</Button>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <Button onClick={onPrev} disabled={loading}>
          Previous
        </Button>
        <Button
          type="primary"
          onClick={onSave}
          disabled={
            loading || !courseData.topics.every((t) => t.exercises.length > 0)
          }
          loading={loading}
        >
          Save Course
        </Button>
      </div>
    </div>
  );
};
