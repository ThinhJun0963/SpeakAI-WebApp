import React, { useEffect } from "react";
import CourseCard from "./CourseCard";
import useApi from "../../hooks/useApi";
import { courseService } from "../../../services/courseService";

const CourseList = () => {
  const { data: courses, loading, error, execute } = useApi([]);

  const fetchCourses = async () => {
    try {
      await execute(courseService.getAll);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No courses available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onRefresh={fetchCourses} />
      ))}
    </div>
  );
};

export default CourseList;
