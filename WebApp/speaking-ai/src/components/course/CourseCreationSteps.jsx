import React, { useState } from "react";
import { CourseForm } from "./CourseForm";
import { TopicsForm } from "./TopicForm";
import { ExercisesForm } from "./ExerciseForm";
import { StepIndicator } from "./StepIndicator";
import { useCourseCreation } from "../hooks/useCourseCreation";

export const CourseCreationSteps = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    maxPoint: 90,
    isFree: true,
    levelId: 1,
    topics: [],
  });

  const { createCourse, loading, error } = useCourseCreation(onComplete);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSave = async () => {
    try {
      await createCourse(courseData);
    } catch (error) {
      console.error("Failed to create course:", error);
      // Có thể hiển thị thông báo lỗi ở đây
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-red-700 hover:text-red-900"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <CourseForm
          courseData={courseData}
          setCourseData={setCourseData}
          onNext={handleNext}
          onCancel={onCancel}
        />
      )}

      {step === 2 && (
        <TopicsForm
          courseData={courseData}
          setCourseData={setCourseData}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}

      {step === 3 && (
        <ExercisesForm
          courseData={courseData}
          setCourseData={setCourseData}
          onPrev={handlePrev}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </div>
  );
};
