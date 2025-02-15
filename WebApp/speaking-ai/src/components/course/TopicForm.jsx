import React, { useState } from "react";
import { Input } from "../ui/Input";
import { calculateFactors } from "../../utils/calculations";
import Label from "../ui/Label";

export const TopicsForm = ({ courseData, setCourseData, onNext, onPrev }) => {
  const [numberOfTopics, setNumberOfTopics] = useState(1);

  const availableTopicNumbers = calculateFactors(courseData.maxPoint);
  const pointsPerTopic = courseData.maxPoint / numberOfTopics;

  const handleTopicNumberChange = (e) => {
    const newTopicCount = parseInt(e.target.value);
    setNumberOfTopics(newTopicCount);

    const newTopics = Array(newTopicCount)
      .fill(null)
      .map((_, index) => ({
        topicName: `Topic ${index + 1}`,
        points: pointsPerTopic,
        exercises: [],
      }));

    setCourseData((prev) => ({
      ...prev,
      topics: newTopics,
    }));
  };

  const handleTopicNameChange = (index, newName) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      topicName: newName,
    };
    setCourseData((prev) => ({
      ...prev,
      topics: updatedTopics,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Number of Topics</Label>
        <select
          value={numberOfTopics}
          onChange={handleTopicNumberChange}
          className="w-full border rounded p-2"
        >
          {availableTopicNumbers.map((num) => (
            <option key={num} value={num}>
              {num} Topics ({courseData.maxPoint / num} points each)
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {courseData.topics.map((topic, index) => (
          <div key={index} className="flex gap-4 items-center">
            <Input
              value={topic.topicName}
              onChange={(e) => handleTopicNameChange(index, e.target.value)}
              placeholder={`Topic ${index + 1} Name`}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">{topic.points} points</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={courseData.topics.some((topic) => !topic.topicName)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};
