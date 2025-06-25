import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Form, Input, message, Tooltip } from "antd";
import Select from "react-select";
import { Edit, Info } from "lucide-react";
import { EXERCISE_TYPE_OPTIONS } from "../../constants/courseOptions"; // Import từ constants.js

const EditExercisePage = ({
  courseId,
  exerciseId,
  exercise,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (exercise) {
      form.setFieldsValue({
        content: exercise.content,
        typeId: EXERCISE_TYPE_OPTIONS.find(
          (option) => option.value === exercise.typeId
        ),
      });
    }
  }, [exercise, form]);

  const handleFinish = async (values) => {
    try {
      const exerciseData = {
        content: values.content,
        typeId: Number(values.typeId.value),
        questions: exercise.questions, // Giữ nguyên mảng questions từ dữ liệu ban đầu
      };
      await courseApi.updateExercise(exerciseId, exerciseData);
      message.success("Exercise updated successfully.");
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(
        `Failed to update exercise. ${error.message || "Please try again."}`
      );
    }
  };

  const handleBack = () => {
    if (onCancel) onCancel();
    navigate(`/courses/${courseId}/details`);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: "#d1d5db",
      padding: "0.25rem",
      fontSize: "1.125rem",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "1rem",
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": { backgroundColor: "#e0f2fe" },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit Exercise
        </h1>
        <Button
          onClick={handleBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-5 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Back
        </Button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-6"
        >
          <Form.Item
            name="content"
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Exercise Content{" "}
                <Tooltip title="Enter the main content or instruction for the exercise">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: "Please enter exercise content" },
            ]}
          >
            <Input
              placeholder="e.g., Answer the following question"
              className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="typeId"
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Question Type{" "}
                <Tooltip title="Select the type of question">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please select question type" }]}
          >
            <Select
              options={EXERCISE_TYPE_OPTIONS}
              onChange={(option) => form.setFieldsValue({ typeId: option })}
              styles={customStyles}
              placeholder="Select question type"
              className="w-full text-lg"
            />
          </Form.Item>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleBack}
              className="bg-gray-200 text-gray-800 font-medium rounded-lg px-5 py-2.5 hover:bg-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg px-5 py-2.5 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditExercisePage;
