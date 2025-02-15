import React, { useState } from "react";
import { calculateFactors } from "../../utils/calculations";
import Label from "../ui/Label";
import TextArea from "../ui/TextArea";

export const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  loading,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [numberOfExercises, setNumberOfExercises] = useState(1);

  const handleTopicChange = (e) => {
    setSelectedTopicIndex(Number(e.target.value));
    setNumberOfExercises(1);
  };

  const selectedTopic =
    selectedTopicIndex !== null ? courseData.topics[selectedTopicIndex] : null;
  const availableExerciseNumbers = selectedTopic
    ? calculateFactors(selectedTopic.points)
    : [];
  const pointsPerExercise = selectedTopic
    ? selectedTopic.points / numberOfExercises
    : 0;

  const handleExerciseNumberChange = (e) => {
    const newExerciseCount = parseInt(e.target.value);
    setNumberOfExercises(newExerciseCount);

    const newExercises = Array(newExerciseCount)
      .fill(null)
      .map((_, index) => ({
        content: `Exercise ${index + 1}`,
        points: pointsPerExercise,
      }));

    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex] = {
      ...updatedTopics[selectedTopicIndex],
      exercises: newExercises,
    };

    setCourseData((prev) => ({
      ...prev,
      topics: updatedTopics,
    }));
  };

  const handleExerciseContentChange = (index, newContent) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises[index] = {
      ...updatedTopics[selectedTopicIndex].exercises[index],
      content: newContent,
    };
    setCourseData((prev) => ({
      ...prev,
      topics: updatedTopics,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Select Topic</Label>
        <select
          value={selectedTopicIndex ?? ""}
          onChange={handleTopicChange}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>
            Select a topic
          </option>
          {courseData.topics.map((topic, index) => (
            <option key={index} value={index}>
              {topic.topicName} ({topic.points} points)
            </option>
          ))}
        </select>
      </div>

      {selectedTopic && (
        <div>
          <Label>Number of Exercises</Label>
          <select
            value={numberOfExercises}
            onChange={handleExerciseNumberChange}
            className="w-full border rounded p-2"
          >
            {availableExerciseNumbers.map((num) => (
              <option key={num} value={num}>
                {num} Exercises ({selectedTopic.points / num} points each)
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTopic && selectedTopic.exercises && (
        <div className="mt-4 space-y-4">
          {selectedTopic.exercises.map((exercise, index) => (
            <div key={index} className="space-y-2">
              <Label>
                Exercise {index + 1} ({exercise.points} points)
              </Label>
              <TextArea
                value={exercise.content}
                onChange={(e) =>
                  handleExerciseContentChange(index, e.target.value)
                }
                placeholder={`Enter content for Exercise ${index + 1}`}
                className="h-32"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={loading}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          onClick={onSave}
          disabled={
            loading ||
            courseData.topics.some(
              (topic) =>
                topic.exercises.some((exercise) => !exercise.content) ||
                topic.exercises.length === 0
            )
          }
          className={`px-4 py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Creating..." : "Save Course"}
        </button>
      </div>
    </div>
  );
};
