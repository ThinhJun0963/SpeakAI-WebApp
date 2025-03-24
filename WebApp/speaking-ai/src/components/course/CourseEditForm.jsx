import React from "react";
import { courseApi } from "../../api/axiosInstance";
import { Form, Input, Select, Button, Modal, message } from "antd";

const { Option } = Select;

const CourseEditForm = ({ course, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const maxPointOptions = [100, 200, 300, 400, 500];
  const levelOptions = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  const handleFinish = async (values) => {
    try {
      await courseApi.update(course.id, {
        courseName: values.courseName,
        description: values.description,
        maxPoint: values.maxPoint,
        isFree: values.isFree,
        isPremium: values.isPremium,
        levelId: values.levelId,
      });
      message.success("Course updated successfully"); // Thêm thông báo thành công
      onSuccess(); // Gọi onSuccess để đóng form và quay lại trang list
    } catch (error) {
      Modal.error({ title: "Error", content: "Failed to update course." });
    }
  };

  return (
    <Modal title="Edit Course" open={visible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        layout="vertical"
        initialValues={course}
        onFinish={handleFinish}
        className="space-y-4"
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onCancel} className="ml-2">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseEditForm;
