import { useState } from "react";
import { Modal } from "antd";
import useCourseApi from "./useCourseApi";
import { useNavigate } from "react-router-dom";

const useCreateCourse = () => {
  const navigate = useNavigate();
  const { createCourse } = useCourseApi();
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    maxPoint: 90,
    isPremium: false,
    levelId: 1,
    topics: [],
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCourseData({
      courseName: "",
      description: "",
      maxPoint: 90,
      isPremium: false,
      levelId: 1,
      topics: [],
    });
    setStep(1);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1)
      return (
        courseData.courseName &&
        courseData.description &&
        courseData.maxPoint &&
        courseData.levelId
      );
    if (currentStep === 2)
      return (
        courseData.topics.length > 0 &&
        courseData.topics.every((t) => t.topicName)
      );
    if (currentStep === 3)
      return courseData.topics.every(
        (t) =>
          t.exercises.length > 0 &&
          t.exercises.every(
            (e) => e.content.type && e.content.question && e.content.answer
          )
      );
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      Modal.error({
        title: "Validation Error",
        content: "Please fill in all required fields before proceeding.",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCancel = () => {
    Modal.confirm({
      title: "Cancel Creation",
      content:
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      onOk: () => {
        resetForm();
        navigate("/courses");
      },
    });
  };

  const handleSave = async () => {
    if (!validateStep(3)) {
      Modal.error({
        title: "Validation Error",
        content: "Each topic must have at least one fully completed exercise.",
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        courseName: courseData.courseName,
        description: courseData.description,
        maxPoint: courseData.maxPoint,
        isPremium: courseData.isPremium,
        levelId: courseData.levelId,
        topics: courseData.topics.map((topic) => ({
          topicName: topic.topicName,
          maxPoint: topic.maxPoint,
          exercises: topic.exercises.map((exercise) => ({
            content: JSON.stringify(exercise.content),
            maxPoint: exercise.maxPoint,
          })),
        })),
      };
      await createCourse(payload);
      resetForm();
      Modal.success({
        title: "Success",
        content: "Course created successfully!",
        onOk: () => navigate("/courses"),
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: error.message || "Failed to create course.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    courseData,
    loading,
    setCourseData,
    handleNext,
    handlePrev,
    handleCancel,
    handleSave,
  };
};

export default useCreateCourse;
