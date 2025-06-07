// src/hooks/useCourseApi.js
import { useContext } from "react";
import ApiContext from "../context/ApiContext";

export const useCourseApi = () => {
  const { courseApi } = useContext(ApiContext);

  const getAll = async () => await courseApi.getAll(); // Add this method
  const createCourse = async (courseData) => await courseApi.create(courseData);
  const getDetails = async (id) => await courseApi.getDetails(id);
  const updateCourse = async (id, data) => await courseApi.update(id, data);
  const deleteCourse = async (id) => await courseApi.delete(id);
  const addTopic = async (courseId, topicData) =>
    await courseApi.addTopic(courseId, topicData);
  const updateTopic = async (topicId, data) =>
    await courseApi.updateTopic(topicId, data);
  const addExercise = async (topicId, exerciseData) =>
    await courseApi.addExercise(topicId, exerciseData);
  const updateExercise = async (exerciseId, data) =>
    await courseApi.updateExercise(exerciseId, data);

  return {
    getAll,
    createCourse,
    getDetails,
    updateCourse,
    deleteCourse,
    addTopic,
    updateTopic,
    addExercise,
    updateExercise,
  };
};

export default useCourseApi;
