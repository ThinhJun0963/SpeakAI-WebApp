import React, { useState } from "react";
import Label from "../ui/Laybel";
import TextArea from "../ui/TextArea";

export const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  loading,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState({ content: "" });

  const handleAddExercise = () => {
    if (currentExercise.content) {
      const updatedTopics = [...courseData.topics];
      updatedTopics[selectedTopicIndex].exercises.push({ ...currentExercise });
      setCourseData((prev) => ({ ...prev, topics: updatedTopics }));
      setCurrentExercise({ content: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Select Topic</Label>
        <select
          value={selectedTopicIndex}
          onChange={(e) => setSelectedTopicIndex(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          {courseData.topics.map((topic, index) => (
            <option key={index} value={index}>
              {topic.topicName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Exercise Content</Label>
        <TextArea
          value={currentExercise.content}
          onChange={(e) => setCurrentExercise({ content: e.target.value })}
          placeholder="Enter exercise content"
          className="h-32"
        />
        <button
          onClick={handleAddExercise}
          disabled={!currentExercise.content}
          className="mt-2"
        >
          Add Exercise
        </button>
      </div>

      {/* Display exercises for selected topic */}
      <div className="mt-4">
        {courseData.topics[selectedTopicIndex]?.exercises.map(
          (exercise, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
              {exercise.content}
            </div>
          )
        )}
      </div>

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
            courseData.topics.some((topic) => topic.exercises.length === 0)
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
