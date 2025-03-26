import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Tag, Modal, Collapse, Skeleton } from "antd";
import { Edit } from "lucide-react";

const { Panel } = Collapse;

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

  const parseExerciseContent = (content) => {
    try {
      if (typeof content !== "string") {
        throw new Error("Content is not a string");
      }
      if (content.trim().startsWith("{")) {
        return JSON.parse(content);
      }
      return { type: "text", question: content, answer: "", explanation: "" };
    } catch (error) {
      console.warn("Failed to parse exercise content:", content, error);
      return {
        type: "text",
        question: content || "Invalid content",
        answer: "",
        explanation: "Could not parse content",
      };
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton active paragraph={{ rows: 2 }} className="mb-4" />
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    );
  }

  if (!course) return <div className="text-center py-10">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <Button onClick={() => navigate(-1)} className="mb-2 sm:mb-0">
          Back
        </Button>
        <Button
          type="primary"
          icon={<Edit />}
          onClick={() => navigate(`/courses/edit/${course.id}`)}
        >
          Edit Course
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
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
        <p className="mb-2">
          <strong>Status:</strong>{" "}
          <Tag color={course.isPremium ? "orange" : "green"}>
            {course.isPremium ? "Premium" : "Free"}
          </Tag>
        </p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Topics</h2>
      {course.topics?.length > 0 ? (
        <Collapse defaultActiveKey={["0"]}>
          {course.topics.map((topic, index) => (
            <Panel header={topic.topicName} key={index}>
              <p className="text-gray-600">
                <strong>Max Point:</strong> {topic.maxPoint || "N/A"}
              </p>
              <h4 className="mt-2 font-semibold">Exercises</h4>
              {topic.exercises?.length > 0 ? (
                topic.exercises.map((exercise) => {
                  const content = parseExerciseContent(exercise.content);
                  return (
                    <div
                      key={exercise.id}
                      className={`mt-2 p-2 rounded-md ${
                        content.type === "true_false"
                          ? "bg-blue-50"
                          : content.type === "multiple_choice"
                          ? "bg-yellow-50"
                          : "bg-gray-50"
                      }`}
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
            </Panel>
          ))}
        </Collapse>
      ) : (
        <p className="text-gray-500">No topics available</p>
      )}
    </div>
  );
};

export default CourseDetailPage;
