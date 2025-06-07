import { useState, useEffect } from "react";
import { Modal } from "antd";
import useCourseApi from "./useCourseApi";

const useCourseDetail = (id) => {
  const { getDetails } = useCourseApi();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await getDetails(id);
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
  }, [id, getDetails]);

  const parseExerciseContent = (content) => {
    try {
      if (typeof content !== "string")
        throw new Error("Content is not a string");
      if (content.trim().startsWith("{")) return JSON.parse(content);
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

  return { course, loading, parseExerciseContent };
};

export default useCourseDetail;
