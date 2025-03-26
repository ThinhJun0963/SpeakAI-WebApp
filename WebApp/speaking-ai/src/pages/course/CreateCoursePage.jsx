import React, { useState, useEffect } from "react";
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
  const [courseData, setCourseData] = useState(() => {
    const savedData = localStorage.getItem("courseDraft");
    return savedData
      ? JSON.parse(savedData)
      : {
          courseName: "",
          description: "",
          maxPoint: 90,
          isPremium: false,
          levelId: 1,
          topics: [],
        };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("courseDraft", JSON.stringify(courseData));
  }, [courseData]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      const { courseName, description, maxPoint, levelId } = courseData;
      if (!courseName || !description || !maxPoint || !levelId) {
        return false;
      }
    } else if (currentStep === 2 && courseData.topics.length === 0) {
      return false;
    } else if (
      currentStep === 3 &&
      courseData.topics.some((topic) => topic.exercises.length === 0)
    ) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateStep(3)) {
      Modal.error({
        title: "Validation Error",
        content: "Each topic must have at least one exercise.",
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
      };
      const courseResponse = await courseApi.create(payload);
      const courseId = courseResponse.id;

      for (const topic of courseData.topics) {
        const topicPayload = {
          topicName: topic.topicName,
          maxPoint: topic.maxPoint,
          exercises: topic.exercises.map((exercise) => ({
            content: JSON.stringify(exercise.content),
            maxPoint: exercise.maxPoint,
          })),
        };
        await courseApi.addTopic(courseId, topicPayload);
      }

      localStorage.removeItem("courseDraft");
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

  const handleSaveDraft = () => {
    localStorage.setItem("courseDraft", JSON.stringify(courseData));
    Modal.success({
      title: "Draft Saved",
      content: "Your course draft has been saved.",
    });
  };

  const handleStepChange = (direction) => {
    if (direction === "next" && !validateStep(step)) {
      Modal.error({
        title: "Validation Error",
        content: "Please fill in all required fields.",
      });
      return;
    }
    direction === "next" ? handleNext() : handlePrev();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <Card>
        <div className="p-6">
          <StepIndicator
            currentStep={step}
            onStepClick={setStep}
            validateStep={validateStep}
          />
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <>
              {step === 1 && (
                <CourseForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onNext={() => handleStepChange("next")}
                  onCancel={() => navigate("/courses")}
                />
              )}
              {step === 2 && (
                <TopicsForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onNext={() => handleStepChange("next")}
                  onPrev={() => handleStepChange("prev")}
                />
              )}
              {step === 3 && (
                <ExercisesForm
                  courseData={courseData}
                  setCourseData={setCourseData}
                  onPrev={() => handleStepChange("prev")}
                  onSave={handleSave}
                  onSaveDraft={handleSaveDraft}
                  loading={loading}
                />
              )}
            </>
          )}
          {step !== 3 && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveDraft}>Save Draft</Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CreateCoursePage;
