import React, { useState } from "react";
import { courseApi } from "../../api/axiosInstance";
import { Steps, Form, Input, Select, Button, Card, Spin, Alert } from "antd";
import { motion } from "framer-motion";

const { Step } = Steps;
const { Option } = Select;

const CreateCoursePage = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [courseId, setCourseId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxPointOptions = [100, 200, 300, 400, 500];
  const levelOptions = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  const getTopicOptions = (maxPoint) => {
    const divisors = [];
    for (let i = 1; i <= maxPoint; i++)
      if (maxPoint % i === 0) divisors.push(i);
    return divisors;
  };

  const getExerciseOptions = (topicPoints) => {
    const divisors = [];
    for (let i = 1; i <= topicPoints / 10; i++)
      if (topicPoints % (i * 10) === 0) divisors.push(i);
    return divisors;
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const values = await form.validateFields();
      if (currentStep === 0) {
        const courseData = {
          courseName: values.courseName,
          description: values.description,
          maxPoint: values.maxPoint,
          isFree: values.isFree ?? true,
          isPremium: values.isPremium ?? false,
          levelId: values.levelId,
          topics: [], // Thêm topics rỗng để khớp với API
        };
        const response = await courseApi.create(courseData);
        setCourseId(response?.id || "temp-id"); // Giả định BE trả ID trong result
        setCurrentStep(1);
      } else if (currentStep === 1) {
        const topicCount = values.topicCount;
        setTopics(
          Array.from({ length: topicCount }, () => ({
            topicName: "",
            exercises: [],
          }))
        );
        setCurrentStep(2);
      } else if (currentStep === 2) {
        for (let i = 0; i < topics.length; i++) {
          const topicResponse = await courseApi.addTopic(courseId, {
            topicName: values[`topicName${i}`],
            exercises: [],
          });
          const topicId = topicResponse?.id || `temp-topic-${i}`;
          const exerciseCount = values[`exerciseCount${i}`];
          for (let j = 0; j < exerciseCount; j++) {
            await courseApi.addExercise(topicId, {
              content: values[`exerciseContent${i}-${j}`],
            });
          }
        }
        onComplete();
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) onCancel();
    else setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Course Info",
      content: (
        <Form form={form} layout="vertical" className="space-y-4">
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
            label="Max Points"
            rules={[{ required: true, message: "Please select max points" }]}
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
          <Form.Item name="isFree" label="Free Course" valuePropName="checked">
            <Select placeholder="Is this course free?">
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isPremium"
            label="Premium Course"
            valuePropName="checked"
          >
            <Select placeholder="Is this course premium?">
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Topics",
      content: (
        <Form form={form} layout="vertical" className="space-y-4">
          <Form.Item
            name="topicCount"
            label="Number of Topics"
            rules={[
              { required: true, message: "Please select number of topics" },
            ]}
          >
            <Select placeholder="Select number of topics">
              {getTopicOptions(form.getFieldValue("maxPoint") || 100).map(
                (count) => (
                  <Option key={count} value={count}>
                    {count}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Exercises",
      content: (
        <Form form={form} layout="vertical" className="space-y-4">
          {topics.map((_, index) => (
            <Card key={index} title={`Topic ${index + 1}`} className="mb-4">
              <Form.Item
                name={`topicName${index}`}
                label="Topic Name"
                rules={[{ required: true, message: "Please enter topic name" }]}
              >
                <Input placeholder="Enter topic name" />
              </Form.Item>
              <Form.Item
                name={`exerciseCount${index}`}
                label="Number of Exercises"
                rules={[
                  {
                    required: true,
                    message: "Please select number of exercises",
                  },
                ]}
              >
                <Select placeholder="Select number of exercises">
                  {getExerciseOptions(
                    form.getFieldValue("maxPoint") || 100
                  ).map((count) => (
                    <Option key={count} value={count}>
                      {count}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {Array.from({
                length: form.getFieldValue(`exerciseCount${index}`) || 0,
              }).map((_, exIndex) => (
                <Form.Item
                  key={exIndex}
                  name={`exerciseContent${index}-${exIndex}`}
                  label={`Exercise ${exIndex + 1}`}
                  rules={[
                    {
                      required: true,
                      message: "Please enter exercise content",
                    },
                  ]}
                >
                  <Input placeholder="Enter exercise content" />
                </Form.Item>
              ))}
            </Card>
          ))}
        </Form>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <Steps current={currentStep} className="mb-6">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" />
      )}
      {loading ? <Spin /> : steps[currentStep].content}
      <div className="mt-6 flex justify-between">
        <Button onClick={handleBack}>Back</Button>
        <Button type="primary" onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateCoursePage;
