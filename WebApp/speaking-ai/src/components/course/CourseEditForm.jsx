import React, { useState, useEffect } from "react";
import { Button, Input, Select, Checkbox, Modal, Form } from "antd";
import { courseApi } from "../../api/axiosInstance";

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

const CourseEditForm = ({ course, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue({
        courseName: course.courseName,
        description: course.description,
        maxPoint: course.maxPoint,
        isFree: course.isFree,
        levelId: course.levelId,
      });
    }
  }, [visible, course, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await courseApi.update(course.id, values);
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.error("Failed to update course:", error);
      Modal.error({
        title: "Update Failed",
        content: "Failed to update the course. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Course"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          courseName: "",
          description: "",
          maxPoint: 90,
          isFree: true,
          levelId: 1,
        }}
      >
        <Form.Item
          name="courseName"
          label="Course Name"
          rules={[{ required: true, message: "Please enter the course name" }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter the course description" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Form.Item name="maxPoint" label="Maximum Points">
          <Select placeholder="Select maximum points">
            {POINT_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="levelId" label="Level">
          <Select placeholder="Select course level">
            {LEVEL_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isFree" valuePropName="checked">
          <Checkbox>Free Course</Checkbox>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            type="default"
            onClick={onCancel}
            style={{ marginRight: 8 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Course
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseEditForm;
