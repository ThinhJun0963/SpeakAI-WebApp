import { useState, useEffect } from "react";

export const useTopics = (courseId) => {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const course = await courseApi.getDetails(courseId);
        setTopics(course.topics || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      }
    };
    if (courseId) fetchTopics();
  }, [courseId]);

  const addTopic = (topic) => {
    setTopics((prev) => [...prev, topic]);
  };

  const updateTopic = (topicId, updatedTopic) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, ...updatedTopic } : t))
    );
  };

  const removeTopic = (topicId) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
  };

  const addExerciseToTopic = (topicId, exercise) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId
          ? { ...topic, exercises: [...(topic.exercises || []), exercise] }
          : topic
      )
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
