import React, { useState, useEffect } from "react";
import { Button, Input, Select, Checkbox, Modal, Form, Tag } from "antd";
import { courseApi } from "../../api/axiosInstance";

const { Option } = Select;

const POINT_OPTIONS = [
  { value: 100, label: "100 points" },
  { value: 200, label: "200 points" },
  { value: 300, label: "300 points" },
  { value: 400, label: "400 points" },
  { value: 500, label: "500 points" },
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
      const isFree = course.isFree !== undefined ? course.isFree : true;
      const isPremium =
        course.isPremium !== undefined ? course.isPremium : false;
      console.log(
        "Initial course data:",
        course,
        "isFree:",
        isFree,
        "isPremium:",
        isPremium
      );
      form.setFieldsValue({
        courseName: course.courseName,
        description: course.description,
        maxPoint: course.maxPoint,
        isFree: isFree, // Đồng bộ isFree từ course
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
        isFree: values.isFree, // Gửi isFree như người dùng chọn
        levelId: values.levelId,
      };
      console.log("Data sent to update API:", updatedCourse);
      await courseApi.update(course.id, updatedCourse);
      console.log("Update successful");
      onSuccess(updatedCourse.isFree); // Truyền isFree để CourseCard cập nhật
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

  const isPremium = course?.isPremium !== undefined ? course.isPremium : false;

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
          maxPoint: 100,
          isFree: true, // Mặc định Free
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

        <Form.Item
          name="maxPoint"
          label="Maximum Points"
          rules={[{ required: true, message: "Please select maximum points" }]}
        >
          <Select placeholder="Select maximum points">
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

        <Form.Item label="Course Type" style={{ marginBottom: 0 }}>
          <Form.Item name="isFree" valuePropName="checked" noStyle>
            <Checkbox disabled={!isPremium}>
              Free (Uncheck to disable Free status for Premium courses)
            </Checkbox>
          </Form.Item>
          <div style={{ marginTop: 8 }}>
            {form.getFieldValue("isFree") && <Tag color="#52c41a">Free</Tag>}
            {isPremium && <Tag color="#faad14">Premium</Tag>}
          </div>
        </Form.Item>

        <Form.Item className="flex justify-end mt-6">
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
