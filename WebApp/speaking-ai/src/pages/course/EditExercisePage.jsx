import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Form, Input, Select, message, Space, Tooltip } from "antd";
import { Edit, Info } from "lucide-react";

const { Option } = Select;

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
        maxPoint: exercise.maxPoint,
        typeId: exercise.typeId,
        questionContent: exercise.questions?.[0]?.content || "",
        answers: exercise.questions?.[0]?.answers.map((a) => ({
          answerContent: a.content,
          isCorrect: a.isCorrect.toString(),
        })) || [{ answerContent: "", isCorrect: "false" }],
      });
    }
  }, [exercise, form]);

  const handleFinish = async (values) => {
    try {
      const exerciseData = {
        content: values.content,
        maxPoint: values.maxPoint || 10,
        typeId: Number(values.typeId),
        questions: [
          {
            content: values.questionContent,
            answers: values.answers.map((a) => ({
              content: a.answerContent,
              isCorrect: a.isCorrect === "true",
            })),
          },
        ],
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
            name="maxPoint"
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Max Point{" "}
                <Tooltip title="Enter the maximum points for this exercise">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please enter max point" }]}
          >
            <Input
              type="number"
              placeholder="e.g., 10"
              className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="typeId"
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Question Type{" "}
                <Tooltip title="Select the type of question (1: Multiple Choice, 2: Fill in Blank, 3: True/False)">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please select question type" }]}
          >
            <Select
              placeholder="Select question type"
              className="w-full rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Option value={1}>Multiple Choice</Option>
              <Option value={2}>Fill in Blank</Option>
              <Option value={3}>True/False</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="questionContent"
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Question Content{" "}
                <Tooltip title="Enter the specific question text">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: "Please enter question content" },
            ]}
          >
            <Input
              placeholder="e.g., Is this statement true?"
              className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-lg font-medium text-gray-800 flex items-center">
                Answers{" "}
                <Tooltip title="Add or edit possible answers for the question">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
          >
            <Form.List name="answers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      className="flex items-center mb-4"
                      align="baseline"
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "answerContent"]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter answer content",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g., Yes"
                          className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "isCorrect"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select if correct",
                          },
                        ]}
                      >
                        <Select
                          className="w-40 rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          getPopupContainer={(trigger) => trigger.parentNode}
                        >
                          <Option value="true">Correct</Option>
                          <Option value="false">Incorrect</Option>
                        </Select>
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          onClick={() => remove(field.name)}
                          className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Remove
                        </Button>
                      )}
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({ answerContent: "", isCorrect: "false" })
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-5 py-2.5 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Add Answer
                  </Button>
                </>
              )}
            </Form.List>
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
