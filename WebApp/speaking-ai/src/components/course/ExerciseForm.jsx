import React, { useState, useEffect } from "react";
import { Button, Input, Select, Input as AntdInput } from "antd";
import { calculateFactors } from "../../utils/helpers";

const { TextArea } = AntdInput;
const { Option } = Select;

const EXERCISE_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "fill_in_the_blank", label: "Fill in the Blank" },
  { value: "true_false", label: "True/False" },
];
const TRUE_FALSE_OPTIONS = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

const ExercisesForm = ({
  courseData,
  setCourseData,
  onPrev,
  onSave,
  loading,
  onCancel,
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [numberOfExercises, setNumberOfExercises] = useState(null);
  const selectedTopic = courseData.topics[selectedTopicIndex];

  useEffect(() => {
    if (selectedTopic && !numberOfExercises) {
      const defaultNumber =
        selectedTopic.exercises.length ||
        calculateFactors(selectedTopic.maxPoint)[0];
      setNumberOfExercises(defaultNumber);
    }
  }, [selectedTopicIndex, courseData.topics]);

  const handleExerciseNumberChange = (value) => {
    setNumberOfExercises(value);
    const exerciseMaxPoint = selectedTopic.maxPoint / value;
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises = Array(value)
      .fill()
      .map((_, i) => ({
        ...(updatedTopics[selectedTopicIndex].exercises[i] || {}),
        content: {
          ...updatedTopics[selectedTopicIndex].exercises[i]?.content,
          type: "",
          question: "",
          options: [],
          answer: "",
          explanation: "",
        },
        maxPoint: exerciseMaxPoint,
      }));
    setCourseData({ ...courseData, topics: updatedTopics });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedTopics = [...courseData.topics];
    updatedTopics[selectedTopicIndex].exercises[index].content[field] = value;
    setCourseData({ ...courseData, topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      <Select
        value={selectedTopicIndex}
        onChange={setSelectedTopicIndex}
        placeholder="Select a topic"
        className="w-full"
      >
        {courseData.topics.map((t, i) => (
          <Option key={i} value={i}>
            {t.topicName}
          </Option>
        ))}
      </Select>
      {selectedTopic && (
        <>
          <Select
            value={numberOfExercises}
            onChange={handleExerciseNumberChange}
            className="w-full"
          >
            {calculateFactors(selectedTopic.maxPoint).map((num) => (
              <Option key={num} value={num}>
                {num} Exercises (Each: {selectedTopic.maxPoint / num} points)
              </Option>
            ))}
          </Select>
          <div className="space-y-4">
            {selectedTopic.exercises.map((e, i) => (
              <div key={i} className="border p-4 rounded-md">
                <Select
                  value={e.content.type}
                  onChange={(v) => handleExerciseChange(i, "type", v)}
                  placeholder="Select Exercise Type"
                  className="w-full mb-2"
                >
                  {EXERCISE_TYPES.map((t) => (
                    <Option key={t.value} value={t.value}>
                      {t.label}
                    </Option>
                  ))}
                </Select>
                <TextArea
                  value={e.content.question}
                  onChange={(ev) =>
                    handleExerciseChange(i, "question", ev.target.value)
                  }
                  placeholder={`Question for Exercise ${i + 1}`}
                  rows={2}
                  className="mb-2"
                />
                {e.content.type === "multiple_choice" && (
                  <Input
                    value={e.content.options.join(", ")}
                    onChange={(ev) =>
                      handleExerciseChange(
                        i,
                        "options",
                        ev.target.value.split(", ")
                      )
                    }
                    placeholder="Options (comma-separated)"
                    className="mb-2"
                  />
                )}
                {e.content.type === "true_false" ? (
                  <Select
                    value={e.content.answer}
                    onChange={(v) => handleExerciseChange(i, "answer", v)}
                    placeholder="Select Answer"
                    className="w-full mb-2"
                  >
                    {TRUE_FALSE_OPTIONS.map((o) => (
                      <Option key={o.value} value={o.value}>
                        {o.label}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    value={e.content.answer}
                    onChange={(ev) =>
                      handleExerciseChange(i, "answer", ev.target.value)
                    }
                    placeholder="Answer"
                    className="mb-2"
                  />
                )}
                <TextArea
                  value={e.content.explanation}
                  onChange={(ev) =>
                    handleExerciseChange(i, "explanation", ev.target.value)
                  }
                  placeholder="Explanation"
                  rows={2}
                  className="mb-2"
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onPrev} disabled={loading}>
          Back
        </Button>
        <Button
          type="primary"
          onClick={onSave}
          disabled={loading || !selectedTopic?.exercises.length}
          loading={loading}
        >
          Save Course
        </Button>
      </div>
    </div>
  );
};

export default ExercisesForm;
