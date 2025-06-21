import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/axiosInstance";
import { Button, Form, Input, message, Tooltip } from "antd";
import { Info } from "lucide-react";

const EditTopicPage = () => {
  const { id, topicId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const topic = await courseApi.getTopic(topicId);
        form.setFieldsValue({
          topicName: topic.topicName,
        });
      } catch (error) {
        message.error("Failed to load topic details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      await courseApi.updateTopic(topicId, values);
      message.success("Topic updated successfully.");
      navigate(`/courses/${id}/details`);
    } catch (error) {
      message.error("Failed to update topic.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/courses/${id}/details`);
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl bg-gradient-to-br from-gray-50 to-white/80 min-h-screen rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Edit Topic
        </h1>
        <Button
          onClick={handleBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Back
        </Button>
      </div>
      <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-gray-200/50">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="space-y-6"
        >
          <Form.Item
            name="topicName"
            label={
              <span className="text-lg font-medium text-indigo-900 flex items-center">
                Topic Name{" "}
                <Tooltip title="Enter a unique name for the topic">
                  <Info className="ml-2 text-gray-400 cursor-help" size={16} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: "Please enter topic name" }]}
          >
            <Input
              placeholder="e.g., Introduction to Grammar"
              className="rounded-xl border-gray-300 p-3 text-lg text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleBack}
              className="bg-gray-100 text-gray-800 font-semibold rounded-xl px-6 py-3 hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditTopicPage;
