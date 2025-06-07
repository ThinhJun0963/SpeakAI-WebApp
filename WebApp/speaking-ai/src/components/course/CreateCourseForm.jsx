import React from "react";
import { Form, Input, InputNumber, Switch, Button, Modal, Select } from "antd";
import { useCourseApi } from "./useCourseApi";

const { Option } = Select;

const CreateCourseForm = ({ visible, onClose, onSuccess }) => {
  const { createCourse } = useCourseApi();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createCourse(values);
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
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
            {[1, 2, 3].map((v) => (
              <Option key={v} value={v}>
                {["Beginner", "Intermediate", "Advanced"][v - 1]}
              </Option>
            ))}
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
