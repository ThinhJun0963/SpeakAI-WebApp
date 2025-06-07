// src/components/course/CourseEditWrapper.jsx
import React from "react";
import { useCourseApi } from "../../hooks/useCourseApi";

const CourseEditWrapper = ({ children }) => {
  const courseApi = useCourseApi();
  return React.cloneElement(children, { courseApi });
};

export default CourseEditWrapper;
// This component wraps the children with the courseApi context, allowing
// the child components to access the courseApi methods and properties.