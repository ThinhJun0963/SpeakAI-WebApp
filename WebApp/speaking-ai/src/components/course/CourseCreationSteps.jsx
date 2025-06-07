import React from "react";
import { Card } from "antd";
import { useCourseApi } from "./useCourseApi";
import { CourseForm, TopicsForm, ExercisesForm } from "./";
import StepIndicator from "./StepIndicator";

const CourseCreationSteps = ({ onComplete, onCancel }) => {
  const { createCourse } = useCourseApi();
  const [step, setStep] = React.useState(1);
  const [courseData, setCourseData] = React.useState({
    courseName: "",
    description: "",
    maxPoint: 100,
    isFree: true,
    isPremium: false,
    levelId: 1,
    topics: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      await createCourse(courseData);
      onComplete();
    } catch (err) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      component: (
        <CourseForm
          courseData={courseData}
          setCourseData={setCourseData}
          onNext={() => setStep(2)}
          onCancel={onCancel}
        />
      ),
      validate: () => !!courseData.courseName,
    },
    {
      component: (
        <TopicsForm
          courseData={courseData}
          setCourseData={setCourseData}
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
          onCancel={onCancel}
        />
      ),
      validate: () => courseData.topics.length > 0,
    },
    {
      component: (
        <ExercisesForm
          courseData={courseData}
          setCourseData={setCourseData}
          onPrev={() => setStep(2)}
          onSave={handleSave}
          loading={loading}
          onCancel={onCancel}
        />
      ),
      validate: () => courseData.topics.every((t) => t.exercises.length > 0),
    },
  ];

  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <Card>
      <div className="p-6">
        <StepIndicator
          currentStep={step}
          onStepClick={setStep}
          validateStep={(i) => steps.slice(0, i).every((s) => s.validate())}
        />
        {steps[step - 1].component}
      </div>
    </Card>
  );
};

export default CourseCreationSteps;
