import React from "react";
import { motion } from "framer-motion";
import { Card } from "antd";
import useCreateCourse from "../../hooks/useCreateCourse";
import CourseForm from "../../components/course/CourseForm";
import TopicsForm from "../../components/course/TopicForm";
import ExercisesForm from "../../components/course/ExerciseForm";
import StepIndicator from "../../components/course/StepIndicator";

const CreateCoursePage = () => {
  const {
    step,
    courseData,
    loading,
    setCourseData,
    handleNext,
    handlePrev,
    handleCancel,
    handleSave,
  } = useCreateCourse();

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
            validateStep={(s) => validateStep(s, courseData)}
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

// Helper function moved to component for validation
const validateStep = (currentStep, courseData) => {
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

export default CreateCoursePage;
