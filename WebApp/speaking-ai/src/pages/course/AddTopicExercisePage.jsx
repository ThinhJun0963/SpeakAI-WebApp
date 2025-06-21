// AddTopicExercisePage.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Form, Input, Select, message, Space } from "antd";
import { Plus, Book } from "lucide-react";

const { Option } = Select;

const AddTopicExercisePage = ({ courseId, course, onCancel, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("topic");
  const [topicForm] = Form.useForm();
  const [exerciseForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");

  useEffect(() => {
    if (topicId && activeTab !== "exercise") {
      setActiveTab("exercise");
    }
  }, [topicId, activeTab]);

  const handleFinish = async (values) => {
    try {
      if (activeTab === "topic") {
        await courseApi.addTopic(courseId, {
          topicName: values.topicName,
          description: values.description,
        });
        message.success("Topic added successfully.");
        topicForm.resetFields();
      } else if (topicId) {
        const exerciseData = {
          content: values.content,
          typeId: values.typeId,
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
        await courseApi.addExercise(topicId, exerciseData);
        message.success("Exercise added successfully.");
        exerciseForm.resetFields();
      } else {
        message.error("Please select a topic to add an exercise.");
        return;
      }
      onSuccess();
    } catch (error) {
      message.error(
        `Failed to add ${activeTab}. ${
          error.message || "Please check required fields."
        }`
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    topicForm.resetFields();
    exerciseForm.resetFields();
  };

  const handleBack = () => {
    if (location.state?.from === "courseDetail") {
      navigate(`/courses/${courseId}/details`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Add to {course?.courseName || "Course"}
        </h1>
        <Button
          onClick={handleBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back
        </Button>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="flex space-x-6 mb-8 border-b-2 border-gray-200 pb-4">
          <Button
            type={activeTab === "topic" ? "primary" : "default"}
            onClick={() => handleTabChange("topic")}
            className="flex items-center rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300"
            style={{
              background:
                activeTab === "topic"
                  ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                  : "#e5e7eb",
              color: activeTab === "topic" ? "#ffffff" : "#374151",
            }}
            disabled={!!topicId}
          >
            <Book className="mr-2" /> Add Topic
          </Button>
          <Button
            type={activeTab === "exercise" ? "primary" : "default"}
            onClick={() => handleTabChange("exercise")}
            className="flex items-center rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300"
            style={{
              background:
                activeTab === "exercise"
                  ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                  : "#e5e7eb",
              color: activeTab === "exercise" ? "#ffffff" : "#374151",
            }}
            disabled={!topicId}
          >
            <Book className="mr-2" /> Add Exercise{" "}
          </Button>
        </div>
        <Form
          form={activeTab === "topic" ? topicForm : exerciseForm}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-6"
        >
          {activeTab === "topic" ? (
            <>
              <Form.Item
                name="topicName"
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Topic Name
                  </span>
                }
                rules={[{ required: true, message: "Please enter topic name" }]}
              >
                <Input
                  placeholder="e.g., Introduction to Grammar"
                  className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a unique name for the topic.
                </p>
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Description
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="e.g., Covers basic grammar rules and exercises"
                  className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Provide a brief description of the topic.
                </p>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="content"
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Exercise Content
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter exercise content" },
                ]}
              >
                <Input
                  placeholder="e.g., Answer the following question"
                  className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the main content or instruction for the exercise.
                </p>
              </Form.Item>
              <Form.Item
                name="typeId"
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Question Type
                  </span>
                }
                rules={[
                  { required: true, message: "Please select question type" },
                ]}
              >
                <Select
                  placeholder="Select question type"
                  className="w-full rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                >
                  <Option value={1}>Yes/No Question</Option>
                  <Option value={2}>Fill in Blank</Option>
                  <Option value={3}>True/False Question</Option>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose the type of question for this exercise.
                </p>
              </Form.Item>
              <Form.Item
                name="questionContent"
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Question Content
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter question content" },
                ]}
              >
                <Input
                  placeholder="e.g., Is this statement true?"
                  className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the specific question text.
                </p>
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-lg font-medium text-gray-800">
                    Answers
                  </span>
                }
              >
                <Form.List
                  name="answers"
                  initialValue={[{ answerContent: "", isCorrect: "false" }]}
                >
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
                              className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
                            <Select className="w-40 rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                              <Option value="true">Correct</Option>
                              <Option value="false">Incorrect</Option>
                            </Select>
                          </Form.Item>
                          <Button
                            onClick={() => remove(field.name)}
                            className="bg-red-500 text-white rounded-xl px-4 py-3 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            Remove
                          </Button>
                        </Space>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() =>
                          add({ answerContent: "", isCorrect: "false" })
                        }
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl px-6 py-3 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Add Answer
                      </Button>
                    </>
                  )}
                </Form.List>
                <p className="text-sm text-gray-500 mt-1">
                  Add possible answers for the question.
                </p>
              </Form.Item>
            </>
          )}
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleBack}
              className="bg-gray-200 text-gray-800 font-medium rounded-xl px-6 py-3 hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl px-6 py-3 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddTopicExercisePage;
