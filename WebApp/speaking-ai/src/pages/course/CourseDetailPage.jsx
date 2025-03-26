import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Tag, Modal } from "antd";
import Loader from "../../components/Loader";

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

  // Hàm parse content từ string JSON sang object
  const parseExerciseContent = (content) => {
    try {
      if (typeof content !== "string") {
        throw new Error("Content is not a string");
      }
      const parsedContent = JSON.parse(content);
      return parsedContent;
    } catch (error) {
      console.warn("Failed to parse exercise content:", content, error);
      // Trả về giá trị mặc định nếu parse thất bại
      return {
        type: "unknown",
        question: content || "Invalid content",
        answer: "",
        explanation: "Could not parse content",
      };
    }
  };

  if (loading) return <Loader />;
  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
      <p className="mb-2">
        <strong>Description:</strong> {course.description || "No description"}
      </p>
      <p className="mb-2">
        <strong>Max Point:</strong> {course.maxPoint || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Level:</strong>{" "}
        {["", "Beginner", "Intermediate", "Advanced"][course.levelId] ||
          "Undefined"}
      </p>
      <p className="mb-4">
        <strong>Status:</strong>{" "}
        <Tag color={course.isPremium ? "orange" : "green"}>
          {course.isPremium ? "Premium" : "Free"}
        </Tag>
      </p>
      <h2 className="text-2xl font-semibold mb-4">Topics</h2>
      {course.topics?.length > 0 ? (
        course.topics.map((topic) => (
          <div
            key={topic.id}
            className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-medium">{topic.topicName}</h3>
            <p className="text-gray-600">
              <strong>Max Point:</strong> {topic.maxPoint || "N/A"}
            </p>
            <h4 className="mt-2 font-semibold">Exercises</h4>
            {topic.exercises?.length > 0 ? (
              topic.exercises.map((exercise) => {
                const content = parseExerciseContent(exercise.content); // Parse chuỗi JSON
                return (
                  <div
                    key={exercise.id}
                    className="mt-2 p-2 bg-white rounded-md"
                  >
                    <p>
                      <strong>Type:</strong> {content.type || "N/A"}
                    </p>
                    <p>
                      <strong>Question:</strong> {content.question || "N/A"}
                    </p>
                    {content.options && content.options.length > 0 && (
                      <p>
                        <strong>Options:</strong> {content.options.join(", ")}
                      </p>
                    )}
                    <p>
                      <strong>Answer:</strong> {content.answer || "N/A"}
                    </p>
                    <p>
                      <strong>Explanation:</strong>{" "}
                      {content.explanation || "N/A"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No exercises available</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No topics available</p>
      )}
    </div>
  );
};

export default CourseDetailPage;
