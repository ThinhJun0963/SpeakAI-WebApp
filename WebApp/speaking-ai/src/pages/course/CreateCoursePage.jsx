import React, { useState } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Card, Modal, Button, Skeleton } from "antd";
import { CourseForm } from "../../components/course/CourseForm";
import { TopicsForm } from "../../components/course/TopicForm";
import { ExercisesForm } from "../../components/course/ExerciseForm";
import { StepIndicator } from "../../components/course/StepIndicator";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const CreateCoursePage = () => {
  const navigate = useNavigate();
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
    if (currentStep === 1) {
      const { courseName, description, maxPoint, levelId } = courseData;
      return courseName && description && maxPoint && levelId;
    }
    if (currentStep === 2) {
      return (
        courseData.topics.length > 0 &&
        courseData.topics.every((t) => t.topicName)
      );
    }
    if (currentStep === 3) {
      return courseData.topics.every(
        (t) =>
          t.exercises.length > 0 &&
          t.exercises.every(
            (e) => e.content.type && e.content.question && e.content.answer
          )
      );
    }
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

      await courseApi.create(payload);
      resetForm(); // Reset form sau khi tạo thành công
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <Card className="shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
          <StepIndicator
            currentStep={step}
            onStepClick={setStep}
            validateStep={validateStep}
          />
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <div className="min-h-[400px]">
              {step === 1 && (
                <CourseForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onNext={handleNext}
                  onCancel={handleCancel}
                />
              )}
              {step === 2 && (
                <TopicsForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onCancel={handleCancel}
                />
              )}
              {step === 3 && (
                <ExercisesForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onPrev={handlePrev}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  loading={loading}
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CreateCoursePage;
