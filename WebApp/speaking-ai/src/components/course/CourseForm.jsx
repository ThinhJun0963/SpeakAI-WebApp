import React from "react";
import { Form, Input, Select, Checkbox, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const POINT_OPTIONS = [
  { value: 90, label: "90 points" },
  { value: 100, label: "100 points" },
  { value: 200, label: "200 points" },
];

const LEVEL_OPTIONS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

export const CourseForm = ({ courseData, setCourseData, onNext, onCancel }) => {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues, allValues) => {
    setCourseData((prev) => ({ ...prev, ...allValues }));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={courseData}
      onValuesChange={handleValuesChange}
      onFinish={onNext}
    >
      <Form.Item
        name="courseName"
        label={
          <span>
            Course Name{" "}
            <Tooltip title="Enter a unique name for the course">
              <InfoCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: "Please enter course name" }]}
      >
        <Input placeholder="Enter course name" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter description" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter course description" />
      </Form.Item>
      <Form.Item
        name="maxPoint"
        label="Max Point"
        rules={[{ required: true, message: "Please select max point" }]}
      >
        <Select placeholder="Select max point">
          {POINT_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="levelId"
        label="Level"
        rules={[{ required: true, message: "Please select level" }]}
      >
        <Select placeholder="Select course level">
          {LEVEL_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="isPremium" valuePropName="checked">
        <Checkbox>Premium</Checkbox>
      </Form.Item>
      <div className="flex justify-between pt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};
