import React, { useState } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Card, Steps, Form, Input, Select, Button, Alert, Spin } from "antd";

const { Step } = Steps;
const { Option } = Select;

const CreateCoursePage = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    maxPoint: null,
    isFree: true,
    levelId: null,
    topics: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const maxPointOptions = [100, 200, 300, 400, 500];
  const levelOptions = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  const getTopicOptions = (maxPoint) => {
    if (!maxPoint) return [];
    const divisors = [];
    for (let i = 1; i <= maxPoint; i++) {
      if (maxPoint % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const getExerciseOptions = (topicPoints) => {
    const divisors = [];
    for (let i = 1; i <= topicPoints / 10; i++) {
      if (topicPoints % (i * 10) === 0) divisors.push(i);
    }
    return divisors;
  };

  const handleNext = async (values) => {
    if (currentStep === 2) {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        await courseApi.create(courseData);
        setSuccess(true);
        form.resetFields();
        setCourseData({
          courseName: "",
          description: "",
          maxPoint: null,
          isFree: true,
          levelId: null,
          topics: [],
        });
        setCurrentStep(0);
        onComplete();
      } catch (err) {
        setError(err.message || "Failed to create course");
      } finally {
        setLoading(false);
      }
    } else {
      const formValues = form.getFieldsValue();
      if (currentStep === 0) {
        setCourseData((prev) => ({
          ...prev,
          courseName: formValues.courseName,
          description: formValues.description,
          maxPoint: formValues.maxPoint,
          isFree: formValues.isFree ?? true,
          levelId: formValues.levelId,
        }));
      } else if (currentStep === 1) {
        const topicCount = formValues.topicCount;
        setCourseData((prev) => ({
          ...prev,
          topics: Array.from({ length: topicCount }, () => ({
            topicName: "",
            exercises: [],
          })),
        }));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) onCancel();
    else setCurrentStep(currentStep - 1);
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = [...courseData.topics];
    newTopics[index][field] = value;
    setCourseData((prev) => ({ ...prev, topics: newTopics }));
  };

  const handleExerciseChange = (topicIndex, exerciseIndex, value) => {
    const newTopics = [...courseData.topics];
    newTopics[topicIndex].exercises[exerciseIndex].content = value;
    setCourseData((prev) => ({ ...prev, topics: newTopics }));
  };

  const handleExerciseCountChange = (topicIndex, count) => {
    const newTopics = [...courseData.topics];
    newTopics[topicIndex].exercises = Array.from({ length: count }, () => ({
      content: "",
    }));
    setCourseData((prev) => ({ ...prev, topics: newTopics }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleNext}
            initialValues={{ isFree: true }}
          >
            <Form.Item
              name="courseName"
              label="Course Name"
              rules={[{ required: true, message: "Please enter course name" }]}
            >
              <Input placeholder="Enter course name" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea placeholder="Enter description" rows={4} />
            </Form.Item>
            <Form.Item
              name="maxPoint"
              label="Maximum Points"
              rules={[
                { required: true, message: "Please select maximum points" },
              ]}
            >
              <Select placeholder="Select max points">
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
            <Form.Item name="isFree" valuePropName="checked">
              <Checkbox>Free</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Next
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <Form form={form} layout="vertical" onFinish={handleNext}>
            <Form.Item
              name="topicCount"
              label={`Number of Topics (Max Point: ${courseData.maxPoint})`}
              rules={[
                { required: true, message: "Please select number of topics" },
              ]}
            >
              <Select placeholder="Select number of topics">
                {getTopicOptions(courseData.maxPoint).map((num) => (
                  <Option key={num} value={num}>
                    {num} (Each topic: {courseData.maxPoint / num} points)
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Next
              </Button>
            </Form.Item>
          </Form>
        );
      case 2:
        return (
          <Form form={form} layout="vertical" onFinish={handleNext}>
            {courseData.topics.map((topic, index) => {
              const topicPoints =
                courseData.maxPoint / courseData.topics.length;
              return (
                <Card
                  key={index}
                  title={`Topic ${index + 1} (${topicPoints} points)`}
                  className="mb-4"
                >
                  <Form.Item label="Topic Name">
                    <Input
                      value={topic.topicName}
                      onChange={(e) =>
                        handleTopicChange(index, "topicName", e.target.value)
                      }
                      placeholder={`Enter name for Topic ${index + 1}`}
                    />
                  </Form.Item>
                  <Form.Item label="Number of Exercises">
                    <Select
                      onChange={(value) =>
                        handleExerciseCountChange(index, value)
                      }
                      placeholder="Select number of exercises"
                    >
                      {getExerciseOptions(topicPoints).map((num) => (
                        <Option key={num} value={num}>
                          {num} (Each exercise: {topicPoints / num} points)
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {topic.exercises.map((exercise, exIndex) => (
                    <Form.Item
                      key={exIndex}
                      label={`Exercise ${exIndex + 1} Content`}
                    >
                      <Input
                        value={exercise.content}
                        onChange={(e) =>
                          handleExerciseChange(index, exIndex, e.target.value)
                        }
                        placeholder={`Enter content for Exercise ${
                          exIndex + 1
                        }`}
                      />
                    </Form.Item>
                  ))}
                </Card>
              );
            })}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Create
              </Button>
            </Form.Item>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg">
      <Steps current={currentStep} className="mb-6">
        <Step title="Course Details" />
        <Step title="Add Topics" />
        <Step title="Add Exercises" />
      </Steps>
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      {success && (
        <Alert
          message="Success"
          description="Course created successfully!"
          type="success"
          showIcon
          className="mb-4"
        />
      )}
      {renderStepContent()}
      <Button onClick={handleBack} disabled={loading}>
        {currentStep === 0 ? "Cancel" : "Back"}
      </Button>
    </Card>
  );
};

export default CreateCoursePage;
