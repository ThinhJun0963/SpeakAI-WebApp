import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { courseApi } from "../../api/axiosInstance";
import {
  MAX_POINT_OPTIONS,
  LEVEL_OPTIONS,
} from "../../constants/courseOptions";

const { Option } = Select;

const CourseEditForm = ({ courseId, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (visible && courseId) {
      const fetchCourse = async () => {
        setFetchLoading(true);
        try {
          const data = await courseApi.getDetails(courseId);
          setCourseData(data);
          form.setFieldsValue({
            courseName: data.courseName,
            description: data.description,
            maxPoint: data.maxPoint,
            levelId: data.levelId,
            isPremium: data.isPremium,
          });
          setImageFile(null); // Reset image file on load
        } catch (error) {
          console.error("Error fetching course data:", error);
          Modal.error({
            title: "Error",
            content: "Failed to load course data.",
          });
        } finally {
          setFetchLoading(false);
        }
      };
      fetchCourse();
    }
  }, [visible, courseId, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const updatedData = { ...values };
      if (imageFile) updatedData.image = imageFile;
      await courseApi.update(courseId, updatedData);
      Modal.success({
        title: "Success",
        content: "Course updated successfully.",
        onOk: onSuccess,
      });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Failed to update course.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ file }) => {
    setImageFile(file);
    return false; // Prevent default upload
  };

  return (
    <Modal
      title="Edit Course"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="rounded-xl"
    >
      {fetchLoading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-6 p-4"
        >
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="Enter course name" className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="maxPoint"
            label="Max Point"
            rules={[{ required: true, message: "Please select max point" }]}
          >
            <Select
              placeholder="Select max point"
              className="w-full rounded-md"
            >
              {MAX_POINT_OPTIONS.map((option) => (
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
            <Select placeholder="Select level" className="w-full rounded-md">
              {LEVEL_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="isPremium"
            label="Premium Status"
            valuePropName="checked"
          >
            <input
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item
            name="image"
            label="Course Image"
            rules={[{ required: false, message: "Please upload an image" }]}
          >
            <Upload
              beforeUpload={handleUpload}
              fileList={imageFile ? [imageFile] : []}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image (JPG/PNG)</Button>
            </Upload>
          </Form.Item>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={onCancel}
              disabled={loading}
              className="rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="rounded-md bg-blue-600"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default CourseEditForm;
