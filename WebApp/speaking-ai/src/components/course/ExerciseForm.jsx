import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

// Hàm tính các ước số của một số
const calculateFactors = (number) => {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
};

export const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  loading,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0); // Mặc định chọn topic đầu tiên
  const [numberOfExercises, setNumberOfExercises] = useState(null);

  const selectedTopic =
    selectedTopicIndex !== null ? courseData.topics[selectedTopicIndex] : null;

  const availableExerciseNumbers = selectedTopic
    ? calculateFactors(selectedTopic.maxPoint)
    : [];

  useEffect(() => {
    // Đặt mặc định số lượng bài tập cho topic đầu tiên
    if (selectedTopic && !numberOfExercises) {
      handleExerciseNumberChange(availableExerciseNumbers[0]);
    }
  }, [selectedTopicIndex, courseData.topics]);

  const handleTopicChange = (value) => {
    setSelectedTopicIndex(value);
    setNumberOfExercises(null); // Reset khi đổi topic
  };

  const handleExerciseNumberChange = (value) => {
    const newExerciseCount = value;
    setNumberOfExercises(newExerciseCount);
    const exerciseMaxPoint = selectedTopic.maxPoint / newExerciseCount; // Chia đều điểm
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises = Array(newExerciseCount)
      .fill(null)
      .map(() => ({ content: "", maxPoint: exerciseMaxPoint }));
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  const handleExerciseContentChange = (index, newContent) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises[index] = {
      ...updatedTopics[selectedTopicIndex].exercises[index],
      content: newContent,
    };
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Chọn chủ đề
        </label>
        <Select
          value={selectedTopicIndex}
          onChange={handleTopicChange}
          placeholder="Chọn một chủ đề"
          className="w-full rounded-md"
        >
          {courseData.topics.map((topic, index) => (
            <Option key={index} value={index}>
              {topic.topicName}
            </Option>
          ))}
        </Select>
      </div>
      {selectedTopic && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Số lượng bài tập
            </label>
            <Select
              value={numberOfExercises}
              onChange={handleExerciseNumberChange}
              className="w-full rounded-md"
            >
              {availableExerciseNumbers.map((num) => (
                <Option key={num} value={num}>
                  {num} Bài tập (Mỗi bài: {selectedTopic.maxPoint / num} điểm)
                </Option>
              ))}
            </Select>
          </div>
          <div className="space-y-4">
            {selectedTopic.exercises.map((exercise, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bài tập {index + 1}
                </label>
                <TextArea
                  value={exercise.content}
                  onChange={(e) =>
                    handleExerciseContentChange(index, e.target.value)
                  }
                  placeholder={`Nhập nội dung cho bài tập ${index + 1}`}
                  rows={4}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-between mt-6">
        <Button
          onClick={onPrev}
          disabled={loading}
          className="rounded-md border-gray-300 hover:bg-gray-100"
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          onClick={onSave}
          disabled={
            loading || !courseData.topics.every((t) => t.exercises.length > 0)
          }
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Lưu khóa học
        </Button>
      </div>
    </div>
  );
};
