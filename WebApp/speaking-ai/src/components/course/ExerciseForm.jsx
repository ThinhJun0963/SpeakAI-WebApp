import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const calculateFactors = (number) => {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
};

const EXERCISE_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "fill_in_the_blank", label: "Fill in the Blank" },
  { value: "true_false", label: "True/False" },
];

const TRUE_FALSE_OPTIONS = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  onCancel,
  loading,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [numberOfExercises, setNumberOfExercises] = useState(null);

  const selectedTopic =
    selectedTopicIndex !== null ? courseData.topics[selectedTopicIndex] : null;

  const availableExerciseNumbers = selectedTopic
    ? calculateFactors(selectedTopic.maxPoint)
    : [];

  useEffect(() => {
    if (selectedTopic && !numberOfExercises) {
      const existingExercises = selectedTopic.exercises.length;
      const defaultNumber =
        existingExercises > 0 ? existingExercises : availableExerciseNumbers[0];
      handleExerciseNumberChange(defaultNumber);
    }
  }, [selectedTopicIndex, courseData.topics]);

  const handleTopicChange = (value) => {
    setSelectedTopicIndex(value);
    setNumberOfExercises(null);
  };

  const handleExerciseNumberChange = (value) => {
    const newExerciseCount = value;
    setNumberOfExercises(newExerciseCount);
    const exerciseMaxPoint = selectedTopic.maxPoint / newExerciseCount;

    const updatedTopics = [...courseData.topics];
    const currentExercises = updatedTopics[selectedTopicIndex].exercises || [];

    const newExercises = Array(newExerciseCount)
      .fill(null)
      .map((_, index) => {
        if (index < currentExercises.length) {
          return currentExercises[index];
        }
        return {
          content: {
            type: "",
            question: "",
            options: [],
            answer: "",
            explanation: "",
          },
          maxPoint: exerciseMaxPoint,
        };
      });

    updatedTopics[selectedTopicIndex].exercises = newExercises;
    setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises[index].content[field] = value;
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
          className="w-full"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Exercises
            </label>
            <Select
              value={numberOfExercises}
              onChange={handleExerciseNumberChange}
              className="w-full"
            >
              {availableExerciseNumbers.map((num) => (
                <Option key={num} value={num}>
                  {num} Exercises (Each: {selectedTopic.maxPoint / num} points)
                </Option>
              ))}
            </Select>
          </div>
          <div className="space-y-4">
            {selectedTopic.exercises.map((exercise, index) => (
              <div key={index} className="border p-4 rounded-md">
                <Select
                  value={exercise.content.type}
                  onChange={(value) =>
                    handleExerciseChange(index, "type", value)
                  }
                  placeholder="Select Exercise Type"
                  className="w-full mb-2"
                >
                  {EXERCISE_TYPES.map((type) => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
                <TextArea
                  value={exercise.content.question}
                  onChange={(e) =>
                    handleExerciseChange(index, "question", e.target.value)
                  }
                  placeholder={`Question for Exercise ${index + 1}`}
                  rows={2}
                  className="mb-2"
                />
                {exercise.content.type === "multiple_choice" && (
                  <Input
                    value={exercise.content.options.join(", ")}
                    onChange={(e) =>
                      handleExerciseChange(
                        index,
                        "options",
                        e.target.value.split(", ")
                      )
                    }
                    placeholder="Options (comma-separated)"
                    className="mb-2"
                  />
                )}
                {exercise.content.type === "true_false" ? (
                  <Select
                    value={exercise.content.answer}
                    onChange={(value) =>
                      handleExerciseChange(index, "answer", value)
                    }
                    placeholder="Select Answer"
                    className="w-full mb-2"
                  >
                    {TRUE_FALSE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    value={exercise.content.answer}
                    onChange={(e) =>
                      handleExerciseChange(index, "answer", e.target.value)
                    }
                    placeholder="Answer"
                    className="mb-2"
                  />
                )}
                <TextArea
                  value={exercise.content.explanation}
                  onChange={(e) =>
                    handleExerciseChange(index, "explanation", e.target.value)
                  }
                  placeholder="Explanation"
                  rows={2}
                  className="mb-2"
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onPrev} disabled={loading}>
          Back
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
