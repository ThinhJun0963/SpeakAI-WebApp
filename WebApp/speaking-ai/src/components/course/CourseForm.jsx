import { Form, Input, Select, Checkbox, Button } from "antd";
import {
  MAX_POINT_OPTIONS,
  LEVEL_OPTIONS,
} from "../../constants/courseOptions";

const { Option } = Select;

export const CourseForm = ({ courseData, setCourseData, onNext, onCancel }) => {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues, allValues) => {
    setCourseData((prev) => ({ ...prev, ...allValues }));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={courseData}
      onValuesChange={handleValuesChange}
      onFinish={onNext}
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
        <Input.TextArea rows={4} placeholder="Enter course description" />
      </Form.Item>
      <Form.Item
        name="maxPoint"
        label="Max Point"
        rules={[{ required: true, message: "Please select max point" }]}
      >
        <Select placeholder="Select max point">
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
        <Select placeholder="Select course level">
          {LEVEL_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="isPremium" valuePropName="checked">
        <Checkbox>Premium</Checkbox>
      </Form.Item>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};
