import React, { useEffect } from "react";
import { Button, Input, Select, Checkbox, Modal, Form } from "antd";
import { courseApi } from "../../api/axiosInstance";

const { Option } = Select;

const POINT_OPTIONS = [100, 200, 300, 400, 500];
const LEVEL_OPTIONS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

const CourseEditForm = ({ course, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue({
        courseName: course.courseName,
        description: course.description,
        maxPoint: course.maxPoint,
        isFree: course.isFree ?? true,
        levelId: course.levelId,
      });
    }
  }, [visible, course, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedCourse = {
        courseName: values.courseName,
        description: values.description,
        maxPoint: values.maxPoint,
        isFree: values.isFree,
        levelId: values.levelId,
      };
      await courseApi.update(course.id, updatedCourse);
      onSuccess(updatedCourse.isFree);
      form.resetFields();
    } catch (error) {
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
        initialValues={{ isFree: true }}
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
        <Form.Item
          name="maxPoint"
          label="Maximum Points"
          rules={[{ required: true, message: "Please select maximum points" }]}
        >
          <Select placeholder="Select maximum points">
            {POINT_OPTIONS.map((point) => (
              <Option key={point} value={point}>
                {point}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="levelId"
          label="Level"
          rules={[{ required: true, message: "Please select course level" }]}
        >
          <Select placeholder="Select course level">
            {LEVEL_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="isFree" valuePropName="checked">
          <Checkbox>Free</Checkbox>
        </Form.Item>
        <Form.Item className="flex justify-end mt-6">
          <Button
            type="default"
            onClick={onCancel}
            disabled={loading}
            style={{ marginRight: 8 }}
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
