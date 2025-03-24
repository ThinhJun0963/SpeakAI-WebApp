import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/axiosInstance";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Tabs,
  Spin,
  Tag,
} from "antd";

const { Option } = Select;
const { TabPane } = Tabs;

const CourseEditForm = ({ courseId, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [topics, setTopics] = useState([]);
  const maxPointOptions = [100, 200, 300, 400, 500];
  const levelOptions = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  useEffect(() => {
    if (visible && courseId) {
      const fetchCourse = async () => {
        setFetchLoading(true);
        try {
          const data = await courseApi.getDetails(courseId);
          console.log(data);
          setCourseData(data);
          setTopics(data.topics || []);
          form.setFieldsValue({
            courseName: data.courseName,
            description: data.description,
            maxPoint: data.maxPoint,
            levelId: data.levelId,
            isActive: data.isActive,
            isFree: data.isFree,
            // isFree: data.isFree,
          });
        } catch (error) {
          Modal.error({
            title: "Lỗi",
            content: "Không thể tải dữ liệu khóa học.",
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
      // Cập nhật thông tin course, không gửi isPremium
      await courseApi.update(courseId, {
        courseName: values.courseName,
        description: values.description,
        maxPoint: values.maxPoint,
        isFree: values.isFree ,
        levelId: values.levelId,
      });

      const topicPromises = topics.map((topic) =>
        courseApi.updateTopic(topic.id, {
          topicName: topic.topicName,
          isDeleted: topic.isDeleted || false,
          isActive: topic.isActive !== undefined ? topic.isActive : true,
        })
      );

      const exercisePromises = topics.flatMap((topic) =>
        topic.exercises.map((exercise) =>
          courseApi.updateExercise(exercise.id, {
            content: exercise.content,
          })
        )
      );

      await Promise.all([...topicPromises, ...exercisePromises]);

      message.success("Khóa học đã được cập nhật thành công");
      onSuccess();
    } catch (error) {
      Modal.error({ title: "Lỗi", content: "Không thể cập nhật khóa học." });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  const handleExerciseChange = (topicIndex, exerciseIndex, field, value) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].exercises[exerciseIndex][field] = value;
    setTopics(updatedTopics);
  };

  return (
    <Modal
      title="Chỉnh sửa khóa học"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-lg"
      width={800}
    >
      {fetchLoading ? (
        <div className="text-center py-10">
          <Spin tip="Đang tải dữ liệu khóa học..." />
        </div>
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin khóa học" key="1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="space-y-4 p-4"
            >
              <Form.Item
                name="courseName"
                label="Tên khóa học"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khóa học" },
                ]}
              >
                <Input
                  placeholder="Nhập tên khóa học"
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <Input.TextArea
                  placeholder="Nhập mô tả"
                  rows={4}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </Form.Item>
              <Form.Item
                name="maxPoint"
                label="Điểm tối đa"
                rules={[
                  { required: true, message: "Vui lòng chọn điểm tối đa" },
                ]}
              >
                <Select placeholder="Chọn điểm tối đa" className="rounded-md">
                  {maxPointOptions.map((point) => (
                    <Option key={point} value={point}>
                      {point}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="levelId"
                label="Cấp độ"
                rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
              >
                <Select placeholder="Chọn cấp độ" className="rounded-md">
                  {levelOptions.map((level) => (
                    <Option key={level.id} value={level.id}>
                      {level.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="isFree" label="Khóa học miễn phí">
                <Select
                  placeholder="Khóa học này có miễn phí không?"
                  className="rounded-md"
                >
                  <Option value={true}>Có</Option>
                  <Option value={false}>Không</Option>
                </Select>
              </Form.Item>
              <Form.Item className="flex justify-end space-x-2">
                <Button
                  onClick={onCancel}
                  className="rounded-md border-gray-300 hover:bg-gray-100"
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  loading={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Free" key="2">
            <div className="p-4">
              <p>
                Trạng thái Free:{" "}
                {courseData?.isFree ? (
                  <Tag color="green">Có</Tag>
                ) : (
                  <Tag color="red">Không</Tag>
                )}
              </p>
              <p className="text-gray-500">
                Có thể chỉnh sửa trạng thái Free trong tab Thông tin.
              </p>
            </div>
          </TabPane>
          <TabPane tab="Premium" key="3">
            <div className="p-4">
              <p>
                Trạng thái Premium:{" "}
                {courseData?.isPremium ? (
                  <Tag color="orange">Có</Tag>
                ) : (
                  <Tag color="default">Không</Tag>
                )}
              </p>
              <p className="text-gray-500">
                Không thể chỉnh sửa trạng thái Premium.
              </p>
            </div>
          </TabPane>
          <TabPane tab="Chủ đề và bài tập" key="4">
            <div className="p-4 space-y-4">
              {topics.map((topic, topicIndex) => (
                <div key={topic.id} className="border p-4 rounded-md">
                  <Input
                    value={topic.topicName}
                    onChange={(e) =>
                      handleTopicChange(topicIndex, "topicName", e.target.value)
                    }
                    placeholder="Tên chủ đề"
                    className="mb-2"
                  />
                  <p>Điểm tối đa: {topic.maxPoint} (Không thể chỉnh sửa)</p>
                  <div className="space-y-2">
                    {topic.exercises.map((exercise, exerciseIndex) => (
                      <div key={exercise.id} className="ml-4">
                        <Input.TextArea
                          value={exercise.content}
                          onChange={(e) =>
                            handleExerciseChange(
                              topicIndex,
                              exerciseIndex,
                              "content",
                              e.target.value
                            )
                          }
                          placeholder={`Nội dung bài tập ${exerciseIndex + 1}`}
                          rows={2}
                          className="mb-2"
                        />
                        <p>
                          Điểm tối đa: {exercise.maxPoint} (Không thể chỉnh sửa)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
};

export default CourseEditForm;
