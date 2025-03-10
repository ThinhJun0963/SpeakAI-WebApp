import React, { useEffect } from "react";
import CourseCard from "../CourseList/CourseCard";
import useApi from "../../../components/hooks/useApi";
import { courseApi } from "../../../api/axiosInstance"; // Cập nhật import
import { Card } from "antd";

const CourseList = () => {
  const { data: courses, loading, error, execute } = useApi([]);

  useEffect(() => {
    execute(courseApi.getAll)
      .then((result) => console.log("API result:", result))
      .catch((err) => console.error("API error:", err));
  }, [execute]);

  console.log("Rendering CourseList with courses:", courses);

  if (loading) {
    console.log("Returning loading state");
    return <div className="text-center py-10">Loading...</div>;
  }
  if (error) {
    console.log("Returning error state:", error);
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }
  if (!Array.isArray(courses) || courses.length === 0) {
    console.log("Returning no courses state, courses:", courses);
    return <div className="text-center py-10">No courses available</div>;
  }

  console.log("Rendering courses list:", courses);
  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onRefresh={() => execute(courseApi.getAll)} // Cập nhật courseApi
          />
        ))}
      </div>
    </Card>
  );
};

export default CourseList;
