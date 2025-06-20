import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Tag, Modal, Skeleton } from "antd";
import { Edit } from "lucide-react";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await courseApi.getDetails(id);
        setCourse(response);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        Modal.error({
          title: "Error",
          content: "Failed to load course details.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-4" />
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!course)
    return (
      <div className="text-center py-10 text-gray-500">Course not found</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-0 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Back
        </Button>
        <Button
          type="primary"
          icon={<Edit className="mr-2" />}
          onClick={() => navigate(`/courses/edit/${course.id}`)}
          className="bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Edit Course
        </Button>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {course.courseName}
        </h1>
        {course.imageUrl && (
          <img
            src={course.imageUrl}
            alt={course.courseName}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Description:</strong>{" "}
            {course.description || "No description"}
          </p>
          <p>
            <strong>Max Points:</strong> {course.maxPoint || "N/A"}
          </p>
          <p>
            <strong>Level:</strong>{" "}
            {["", "Beginner", "Intermediate", "Advanced"][course.levelId] ||
              "Undefined"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Tag color={course.isPremium ? "orange" : "green"}>
              {course.isPremium ? "Premium" : "Free"}
            </Tag>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
