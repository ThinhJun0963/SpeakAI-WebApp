import React, { useEffect } from "react";
import { Form, Input, Select, Button, Modal, Tabs } from "antd";
import {
  MAX_POINT_OPTIONS,
  LEVEL_OPTIONS,
} from "../../constants/courseOptions";
import useCourseApi from "../../hooks/useCourseApi";

const { TabPane } = Tabs;

const CourseEditForm = ({ courseId, visible, onCancel, onSuccess }) => {
  const { getDetails, updateCourse, updateTopic, updateExercise } =
    useCourseApi();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [topics, setTopics] = React.useState([]);

  useEffect(() => {
    if (visible && courseId) {
      (async () => {
        const data = await getDetails(courseId);
        setTopics(data.topics || []);
        form.setFieldsValue({
          courseName: data.courseName,
          description: data.description,
          maxPoint: data.maxPoint,
          levelId: data.levelId,
          isPremium: data.isPremium,
        });
      })();
    }
  }, [visible, courseId, form, getDetails]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await updateCourse(courseId, values);
      await Promise.all(
        topics.map((t) =>
          updateTopic(t.id, { topicName: t.topicName, maxPoint: t.maxPoint })
        )
      );
      await Promise.all(
        topics.flatMap((t) =>
          t.exercises.map((e) =>
            updateExercise(e.id, { content: e.content, maxPoint: e.maxPoint })
          )
        )
      );
      onSuccess();
    } catch (error) {
      Modal.error({ title: "Error", content: "Failed to update course." });
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
      width={800}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Course Info" key="1">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="space-y-4 p-4"
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
              <Input.TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
            <Form.Item
              name="maxPoint"
              label="Max Point"
              rules={[{ required: true, message: "Please select max point" }]}
            >
              <Select placeholder="Select max point">
                {MAX_POINT_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
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
                {LEVEL_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isPremium" label="Premium Status">
              <Select placeholder="Is this course premium?">
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
            <Form.Item className="flex justify-end space-x-2">
              <Button onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Topics & Exercises" key="2">
          <div className="p-4 space-y-4">
            {topics.map((t, i) => (
              <div key={t.id} className="border p-4 rounded-md">
                <Input
                  value={t.topicName}
                  onChange={(e) =>
                    setTopics((ts) =>
                      ts.map((tt, j) =>
                        j === i ? { ...tt, topicName: e.target.value } : tt
                      )
                    )
                  }
                  placeholder="Topic Name"
                  className="mb-2"
                />
                <p>Max Point: {t.maxPoint} (Cannot be edited)</p>
                {t.exercises.map((e, j) => (
                  <div key={e.id} className="ml-4">
                    <Input.TextArea
                      value={e.content.question}
                      onChange={(ev) =>
                        setTopics((ts) =>
                          ts.map((tt, k) =>
                            k === i
                              ? {
                                  ...tt,
                                  exercises: tt.exercises.map((ee, l) =>
                                    l === j
                                      ? {
                                          ...ee,
                                          content: {
                                            ...ee.content,
                                            question: ev.target.value,
                                          },
                                        }
                                      : ee
                                  ),
                                }
                              : tt
                          )
                        )
                      }
                      placeholder="Question"
                      rows={2}
                      className="mb-2"
                    />
                    <Input
                      value={e.content.answer}
                      onChange={(ev) =>
                        setTopics((ts) =>
                          ts.map((tt, k) =>
                            k === i
                              ? {
                                  ...tt,
                                  exercises: tt.exercises.map((ee, l) =>
                                    l === j
                                      ? {
                                          ...ee,
                                          content: {
                                            ...ee.content,
                                            answer: ev.target.value,
                                          },
                                        }
                                      : ee
                                  ),
                                }
                              : tt
                          )
                        )
                      }
                      placeholder="Answer"
                      className="mb-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CourseEditForm;
