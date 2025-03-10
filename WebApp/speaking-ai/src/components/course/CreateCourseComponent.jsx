import React, { useState } from "react";
import { Form, Input, InputNumber, Switch, Button, Modal, Select } from "antd";
import { courseApi } from "../../api/axiosInstance";

const CreateCourseForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await courseApi.create(values);
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Course"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isFree: true,
          isActive: true,
          isLock: false,
          maxPoint: 0,
          levelId: 1,
        }}
      >
        <Form.Item
          name="courseName"
          label="Course Name"
          rules={[{ required: true, message: "Please enter a course name" }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Form.Item
          name="maxPoint"
          label="Max Points"
          rules={[{ required: true, message: "Please enter max points" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="levelId"
          label="Level"
          rules={[{ required: true, message: "Please select a level" }]}
        >
          <Select>
            <Select.Option value={1}>Beginner</Select.Option>
            <Select.Option value={2}>Intermediate</Select.Option>
            <Select.Option value={3}>Advanced</Select.Option>
            {/* Add more levels as needed */}
          </Select>
        </Form.Item>

        <Form.Item name="isFree" label="Free Course" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="isLock" label="Locked" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Course
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourseForm;
