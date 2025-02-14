import React, { useState } from "react";
import Label from "../ui/Laybel";
import { Input } from "../ui/Input";

export const TopicsForm = ({ courseData, setCourseData, onNext, onPrev }) => {
  const [currentTopic, setCurrentTopic] = useState({ topicName: "" });

  const handleAddTopic = () => {
    if (currentTopic.topicName) {
      setCourseData((prev) => ({
        ...prev,
        topics: [...prev.topics, { ...currentTopic, exercises: [] }],
      }));
      setCurrentTopic({ topicName: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Topic Name</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter topic name"
            value={currentTopic.topicName}
            onChange={(e) => setCurrentTopic({ topicName: e.target.value })}
          />
          <button onClick={handleAddTopic}>Add Topic</button>
        </div>
      </div>

      {/* Display added topics */}
      <div className="mt-4">
        {courseData.topics.map((topic, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
            {topic.topicName}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onPrev}>Previous</button>
        <button onClick={onNext} disabled={courseData.topics.length === 0}>
          Next
        </button>
      </div>
    </div>
  );
};
