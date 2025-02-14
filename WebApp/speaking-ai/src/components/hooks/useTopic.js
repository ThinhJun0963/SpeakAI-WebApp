import { useState } from "react";

export const useTopics = () => {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);

  const addTopic = (topic) => {
    setTopics((prev) => [...prev, topic]);
  };

  const updateTopic = (index, updatedTopic) => {
    setTopics((prev) => prev.map((t, i) => (i === index ? updatedTopic : t)));
  };

  const removeTopic = (index) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const addExerciseToTopic = (topicIndex, exercise) => {
    setTopics((prev) =>
      prev.map((topic, index) => {
        if (index === topicIndex) {
          return {
            ...topic,
            exercises: [...topic.exercises, exercise],
          };
        }
        return topic;
      })
    );
  };

  return {
    topics,
    currentTopic,
    setCurrentTopic,
    addTopic,
    updateTopic,
    removeTopic,
    addExerciseToTopic,
  };
};
