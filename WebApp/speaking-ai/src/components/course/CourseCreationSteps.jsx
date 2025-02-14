import React, { useState } from "react";
import { CourseForm } from "./CourseForm";
import { TopicsForm } from "./TopicForm";
import { ExercisesForm } from "./ExerciseForm";
import { StepIndicator } from "./StepIndicator";

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

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSave = () => {
    onComplete(courseData);
  };

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
        />
      )}
    </div>
  );
};
