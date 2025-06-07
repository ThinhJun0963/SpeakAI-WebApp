import React from "react";
import { BookOpen, ListTodo, Trophy } from "lucide-react";

const StepIndicator = ({ currentStep, onStepClick, validateStep }) => {
  const steps = [
    { number: 1, title: "Course Info", icon: BookOpen },
    { number: 2, title: "Topics", icon: ListTodo },
    { number: 3, title: "Exercises", icon: Trophy },
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isClickable = validateStep(step.number - 1);
            return (
              <div
                key={step.number}
                className={`flex flex-col items-center ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => isClickable && onStepClick(step.number)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-200 ${
                    currentStep >= step.number ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <StepIcon
                    className={`w-5 h-5 ${
                      currentStep >= step.number
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
