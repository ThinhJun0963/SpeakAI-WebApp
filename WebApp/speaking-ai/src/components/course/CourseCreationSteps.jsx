import React, { useState } from "react";
import { CourseForm } from "./CourseForm";
import { TopicsForm } from "./TopicForm";
import { ExercisesForm } from "./ExerciseForm";
import { StepIndicator } from "./StepIndicator";
import { courseApi } from "../../api/axiosInstance";
import { Card } from "antd";

export const CourseCreationSteps = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    maxPoint: 100,
    isFree: true,
    isPremium: false,
    levelId: 1,
    topics: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSave = async () => {
    setLoading(true);
    try {
      await courseApi.create(courseData);
      onComplete();
    } catch (err) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <Card>
      <div className="p-6">
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
    </Card>
  );
};
