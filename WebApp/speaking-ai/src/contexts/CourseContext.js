// contexts/CourseContext.js
import React, { createContext, useContext, useState } from "react";
import { INITIAL_COURSE_STATE } from "../constants/courseConstants";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courseData, setCourseData] = useState(INITIAL_COURSE_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    courseData,
    setCourseData,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
