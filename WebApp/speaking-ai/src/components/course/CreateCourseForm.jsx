import React, { useState } from "react";
import { Form, message } from "antd";
import { courseApi } from "../../api/axiosInstance";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";

// Constants
export const MAX_POINT_OPTIONS = [
  { value: 100, label: "100 points" },
  { value: 200, label: "200 points" },
  { value: 300, label: "300 points" },
  { value: 400, label: "400 points" },
  { value: 500, label: "500 points" },
];

export const LEVEL_OPTIONS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

const CreateCourseForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // Manage file state separately

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Client-side validation
      if (!values.courseName || values.courseName.trim() === "") {
        throw new Error("Course name is required and cannot be empty");
      }
      if (!values.description || values.description.trim() === "") {
        throw new Error("Description is required and cannot be empty");
      }
      if (!file) {
        throw new Error("Image is required");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const formData = new FormData();
      formData.append("CourseName", values.courseName.trim());
      formData.append("Description", values.description.trim());
      formData.append("maxPoint", values.maxPoint || 100);
      formData.append("levelId", values.levelId || 1);
      formData.append("isFree", values.isFree || false);
      formData.append("isPremium", values.isPremium || false);
      formData.append("Image", file);

      console.log("Form Values:", values); // Debug: Log values
      for (let pair of formData.entries()) {
        console.log("FormData:", pair[0] + ", " + pair[1]); // Debug: Log FormData
      }

      const response = await courseApi.create(formData);
      console.log("API Response:", response); // Debug: Log response
      form.resetFields();
      setFile(null); // Clear the file state manually
      message.success("Course created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Failed to create course:",
        error.response?.data || error.message
      );
      message.error(
        error.response?.data?.title ||
          error.response?.data?.errors?.CourseName?.[0] ||
          error.response?.data?.errors?.Description?.[0] ||
          error.response?.data?.errors?.Image?.[0] ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Update file state
  };

  return (
    <Modal
      isOpen={visible}
      onClose={onClose}
      title="Create New Course"
      size="medium"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isFree: true,
          isPremium: false,
          levelId: 1,
          courseName: "",
          description: "",
          maxPoint: 100,
        }}
        className="space-y-6 p-4"
      >
        <div>
          <Label>Course Name</Label>
          <Form.Item
            name="courseName"
            rules={[{ required: true, message: "Please enter a course name" }]}
          >
            <Input placeholder="Enter course name" type="text" />
          </Form.Item>
        </div>

        <div>
          <Label>Description</Label>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea placeholder="Enter course description" rows={4} />
          </Form.Item>
        </div>

        <div>
          <Label>Max Points</Label>
          <Form.Item
            name="maxPoint"
            rules={[{ required: true, message: "Please select max points" }]}
          >
            <Select
              options={MAX_POINT_OPTIONS}
              placeholder="Select max points"
            />
          </Form.Item>
        </div>

        <div>
          <Label>Level</Label>
          <Form.Item
            name="levelId"
            rules={[{ required: true, message: "Please select a level" }]}
          >
            <Select options={LEVEL_OPTIONS} placeholder="Select level" />
          </Form.Item>
        </div>

        <div>
          <Label>Free Course</Label>
          <Form.Item name="isFree" valuePropName="checked">
            <input
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </Form.Item>
        </div>

        <div>
          <Label>Premium Course</Label>
          <Form.Item name="isPremium" valuePropName="checked">
            <input
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </Form.Item>
        </div>

        <div>
          <Label>Course Image</Label>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            disabled={loading}
            variant="secondary"
            size="medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading ? "true" : undefined}
            variant="primary"
            size="medium"
          >
            Create Course
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateCourseForm;
