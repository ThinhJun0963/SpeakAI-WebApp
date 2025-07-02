// AddTopicExercisePage.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Form, Input, message, Select, Tooltip } from "antd";
import { Plus, Book, Info } from "lucide-react";

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
    if (topicId && !topicId.startsWith("undefined")) {
      setActiveTab("exercise");
    } else {
      setActiveTab("topic");
    }
  }, [topicId]);

  const handleFinish = async (values) => {
    try {
      console.log("Form values:", values);
      if (activeTab === "topic") {
        const topicData = {
          topicName: values.topicName,
          description: values.description,
        };
        await courseApi.addTopic(courseId, topicData);
        message.success("Topic added successfully.");
        topicForm.resetFields();
        if (onSuccess) onSuccess();
      } else if (topicId) {
        const content = values.content;
        if (!content) {
          message.error("Please enter exercise content.");
          return;
        }

        const typeId = Number(values.typeId);
        if (!typeId || ![1, 2, 3].includes(typeId)) {
          message.error("Please select a valid question type.");
          return;
        }

        const questions = values.questions || [];
        if (questions.length === 0) {
          message.error("Please add at least one question.");
          return;
        }

        const exerciseData = {
          content: content,
          typeId: typeId,
          questions: questions.map((q) => ({
            content: q.questionContent,
            answers: q.answers.map((a) => ({
              content: a.answerContent,
              isCorrect: a.isCorrect === "true",
            })),
          })),
        };

        console.log("Exercise data sent:", exerciseData);
        await courseApi.addExercise(topicId, exerciseData);
        message.success("Exercise added successfully.");
        exerciseForm.resetFields();
        navigate(`/courses/${courseId}/details`, {
          state: { from: "addExercise" },
        });
        if (onSuccess) onSuccess();
      } else {
        message.error("Please select a topic to add an exercise.");
        return;
      }
    } catch (error) {
      console.error("Error details:", error);
      message.error(
        `Failed to add ${activeTab}. ${error.message || "Please try again."}`
      );
    }
  };

  const handleTabChange = (tab) => {
    if ((tab === "exercise" && topicId) || tab === "topic") {
      setActiveTab(tab);
      topicForm.resetFields();
      exerciseForm.resetFields();
    } else if (tab === "exercise" && !topicId) {
      message.warning("Please select a topic first.");
    }
  };

  const handleBack = () => {
    if (onCancel) onCancel();
    if (location.state?.from === "courseDetail") {
      navigate(`/courses/${courseId}/details`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Add to {course?.courseName || "Course"}
        </h1>
        <Button
          onClick={handleBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-5 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Back
        </Button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex space-x-6 mb-6 border-b-2 border-gray-200 pb-3">
          {activeTab !== "exercise" && (
            <Button
              type={activeTab === "topic" ? "primary" : "default"}
              onClick={() => handleTabChange("topic")}
              className="flex items-center rounded-lg px-5 py-2 text-lg font-semibold transition-all duration-300"
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
          )}
          {activeTab !== "topic" && topicId && (
            <Button
              type={activeTab === "exercise" ? "primary" : "default"}
              onClick={() => handleTabChange("exercise")}
              className="flex items-center rounded-lg px-5 py-2 text-lg font-semibold transition-all duration-300"
              style={{
                background:
                  activeTab === "exercise"
                    ? "linear-gradient(to right, #3b82f6, #8b5cf6)"
                    : "#e5e7eb",
                color: activeTab === "exercise" ? "#ffffff" : "#374151",
              }}
            >
              <Book className="mr-2" /> Add Exercise
            </Button>
          )}
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
                  <span className="text-lg font-medium text-gray-800 flex items-center">
                    Topic Name{" "}
                    <Tooltip title="Enter a unique name for the topic">
                      <Info
                        className="ml-2 text-gray-400 cursor-help"
                        size={16}
                      />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: "Please enter topic name" }]}
              >
                <Input
                  placeholder="e.g., Introduction to Grammar"
                  className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={
                  <span className="text-lg font-medium text-gray-800 flex items-center">
                    Description{" "}
                    <Tooltip title="Provide a brief description of the topic">
                      <Info
                        className="ml-2 text-gray-400 cursor-help"
                        size={16}
                      />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="e.g., Covers basic grammar rules and exercises"
                  className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="content"
                label={
                  <span className="text-lg font-medium text-gray-800 flex items-center">
                    Exercise Content{" "}
                    <Tooltip title="Enter the main content or instruction for the exercise">
                      <Info
                        className="ml-2 text-gray-400 cursor-help"
                        size={16}
                      />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter exercise content" },
                ]}
              >
                <Input
                  placeholder="e.g., Ex2"
                  className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </Form.Item>
              <Form.Item
                name="typeId"
                label={
                  <span className="text-lg font-medium text-gray-800 flex items-center">
                    Question Type{" "}
                    <Tooltip title="Select the type of question (1: Multiple Choice, 2: Fill in Blank, 3: True/False)">
                      <Info
                        className="ml-2 text-gray-400 cursor-help"
                        size={16}
                      />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: true, message: "Please select question type" },
                ]}
              >
                <Select
                  placeholder="Select question type"
                  className="w-full text-lg rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <Option value={1}>Multiple Choice</Option>
                  <Option value={2}>Fill in Blank</Option>
                  <Option value={3}>True/False</Option>
                </Select>
              </Form.Item>
              <Form.List
                name="questions"
                initialValue={[
                  {
                    questionContent: "",
                    answers: [{ answerContent: "", isCorrect: "false" }],
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div
                        key={field.name}
                        className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
                      >
                        <Form.Item
                          label={
                            <span className="text-lg font-medium text-gray-800">
                              Question Content
                            </span>
                          }
                          {...field}
                          name={[field.name, "questionContent"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter question content",
                            },
                          ]}
                        >
                          <Input
                            placeholder="e.g., How are ____ ?"
                            className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </Form.Item>
                        <Form.List name={[field.name, "answers"]}>
                          {(
                            answerFields,
                            { add: addAnswer, remove: removeAnswer }
                          ) => (
                            <>
                              {answerFields.map((answerField) => (
                                <div
                                  key={answerField.name}
                                  className="flex items-center mb-4"
                                >
                                  <Form.Item
                                    {...answerField}
                                    name={[answerField.name, "answerContent"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter answer content",
                                      },
                                    ]}
                                    style={{ flex: 1, marginRight: "8px" }}
                                  >
                                    <Input
                                      placeholder="e.g., you"
                                      className="rounded-lg border-gray-300 p-3 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    {...answerField}
                                    name={[answerField.name, "isCorrect"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please select if correct",
                                      },
                                    ]}
                                    style={{ width: "150px" }}
                                  >
                                    <Select
                                      placeholder="Select"
                                      className="text-lg rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    >
                                      <Option value="true">Correct</Option>
                                      <Option value="false">Incorrect</Option>
                                    </Select>
                                  </Form.Item>
                                  {answerFields.length > 1 && (
                                    <Button
                                      onClick={() =>
                                        removeAnswer(answerField.name)
                                      }
                                      className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ml-2"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() =>
                                  addAnswer({
                                    answerContent: "",
                                    isCorrect: "false",
                                  })
                                }
                                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-5 py-2.5 hover:from-purple-600 hover:to-blue-600 mt-2"
                              >
                                Add Answer
                              </Button>
                            </>
                          )}
                        </Form.List>
                        {fields.length > 1 && (
                          <Button
                            onClick={() => remove(field.name)}
                            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 mt-2"
                          >
                            Remove Question
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          questionContent: "",
                          answers: [{ answerContent: "", isCorrect: "false" }],
                        })
                      }
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg px-5 py-2.5 hover:from-purple-600 hover:to-blue-600 mt-4"
                    >
                      Add Question
                    </Button>
                  </>
                )}
              </Form.List>
            </>
          )}
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

export default AddTopicExercisePage;
