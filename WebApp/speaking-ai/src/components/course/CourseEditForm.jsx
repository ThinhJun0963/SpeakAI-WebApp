import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Form, Input, Select, Button, Modal, Tabs, Skeleton } from "antd";

const { Option } = Select;
const { TabPane } = Tabs;

const CourseEditForm = ({ courseId, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [topics, setTopics] = useState([]);
  const maxPointOptions = [100, 200, 300, 400, 500];
  const levelOptions = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  const parseExerciseContent = (content) => {
    try {
      if (typeof content !== "string") {
        throw new Error("Content is not a string");
      }
      if (content.trim().startsWith("{")) {
        return JSON.parse(content);
      }
      return { type: "text", question: content, answer: "", explanation: "" };
    } catch (error) {
      console.warn("Failed to parse exercise content:", content, error);
      return {
        type: "text",
        question: content || "Invalid content",
        answer: "",
        explanation: "Could not parse content",
      };
    }
  };

  useEffect(() => {
    if (visible && courseId) {
      const fetchCourse = async () => {
        setFetchLoading(true);
        try {
          const data = await courseApi.getDetails(courseId);
          setCourseData(data);
          setTopics(
            data.topics.map((t) => ({
              ...t,
              exercises: t.exercises.map((e) => ({
                ...e,
                content: parseExerciseContent(e.content),
              })),
            }))
          );
          form.setFieldsValue({
            courseName: data.courseName,
            description: data.description,
            maxPoint: data.maxPoint,
            levelId: data.levelId,
            isPremium: data.isPremium,
          });
        } catch (error) {
          console.error("Error fetching course data:", error);
          Modal.error({
            title: "Error",
            content: "Failed to load course data.",
          });
        } finally {
          setFetchLoading(false);
        }
      };
      fetchCourse();
    }
  }, [visible, courseId, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await courseApi.update(courseId, {
        courseName: values.courseName,
        description: values.description,
        maxPoint: values.maxPoint,
        isPremium: values.isPremium,
        levelId: values.levelId,
      });

      const topicPromises = topics.map((topic) =>
        courseApi.updateTopic(topic.id, {
          topicName: topic.topicName,
          isActive: topic.isActive !== undefined ? topic.isActive : true,
        })
      );

      const exercisePromises = topics.flatMap((topic) =>
        topic.exercises.map((exercise) =>
          courseApi.updateExercise(exercise.id, {
            content: JSON.stringify(exercise.content),
          })
        )
      );

      await Promise.all([...topicPromises, ...exercisePromises]);

      Modal.success({
        title: "Success",
        content: "Course updated successfully.",
        onOk: onSuccess,
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Failed to update course.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  const handleExerciseChange = (topicIndex, exerciseIndex, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].exercises[exerciseIndex].content[field] = value;
    setTopics(updatedTopics);
  };

  return (
    <Modal
      title="Edit Course"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {fetchLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Course Info" key="1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="space-y-4 p-4"
            >
              <Form.Item
                name="courseName"
                label="Course Name"
                rules={[
                  { required: true, message: "Please enter course name" },
                ]}
              >
                <Input placeholder="Enter course name" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
              <Form.Item
                name="maxPoint"
                label="Max Point"
                rules={[{ required: true, message: "Please select max point" }]}
              >
                <Select placeholder="Select max point">
                  {maxPointOptions.map((point) => (
                    <Option key={point} value={point}>
                      {point}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="levelId"
                label="Level"
                rules={[{ required: true, message: "Please select level" }]}
              >
                <Select placeholder="Select level">
                  {levelOptions.map((level) => (
                    <Option key={level.id} value={level.id}>
                      {level.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="isPremium" label="Premium Status">
                <Select placeholder="Is this course premium?">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
              <Form.Item className="flex justify-end space-x-2">
                <Button onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Topics & Exercises" key="2">
            <div className="p-4 space-y-4">
              {topics.map((topic, topicIndex) => (
                <div key={topic.id} className="border p-4 rounded-md">
                  <Input
                    value={topic.topicName}
                    onChange={(e) =>
                      handleTopicChange(topicIndex, "topicName", e.target.value)
                    }
                    placeholder="Topic Name"
                    className="mb-2"
                  />
                  <p>Max Point: {topic.maxPoint} (Cannot be edited)</p>
                  <div className="space-y-2">
                    {topic.exercises.map((exercise, exerciseIndex) => (
                      <div key={exercise.id} className="ml-4">
                        <Input
                          value={exercise.content.type}
                          onChange={(e) =>
                            handleExerciseChange(
                              topicIndex,
                              exerciseIndex,
                              "type",
                              e.target.value
                            )
                          }
                          placeholder="Exercise Type"
                          className="mb-2"
                        />
                        <Input.TextArea
                          value={exercise.content.question}
                          onChange={(e) =>
                            handleExerciseChange(
                              topicIndex,
                              exerciseIndex,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="Question"
                          rows={2}
                          className="mb-2"
                        />
                        {exercise.content.type === "multiple_choice" && (
                          <Input
                            value={exercise.content.options?.join(", ")}
                            onChange={(e) =>
                              handleExerciseChange(
                                topicIndex,
                                exerciseIndex,
                                "options",
                                e.target.value.split(", ")
                              )
                            }
                            placeholder="Options (comma-separated)"
                            className="mb-2"
                          />
                        )}
                        <Input
                          value={exercise.content.answer}
                          onChange={(e) =>
                            handleExerciseChange(
                              topicIndex,
                              exerciseIndex,
                              "answer",
                              e.target.value
                            )
                          }
                          placeholder="Answer"
                          className="mb-2"
                        />
                        <Input.TextArea
                          value={exercise.content.explanation}
                          onChange={(e) =>
                            handleExerciseChange(
                              topicIndex,
                              exerciseIndex,
                              "explanation",
                              e.target.value
                            )
                          }
                          placeholder="Explanation"
                          rows={2}
                          className="mb-2"
                        />
                        <p>Max Point: {exercise.maxPoint} (Cannot be edited)</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default CourseEditForm;
