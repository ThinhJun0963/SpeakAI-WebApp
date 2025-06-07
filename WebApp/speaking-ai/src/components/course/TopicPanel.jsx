import React from "react";
import { Collapse } from "antd";
import { Skeleton } from "antd";

const { Panel } = Collapse;

const TopicPanel = ({ topics, parseExerciseContent, loading }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Topics</h2>
      {topics?.length > 0 ? (
        <Collapse defaultActiveKey={["0"]}>
          {topics.map((topic, index) => (
            <Panel header={topic.topicName} key={index}>
              <p className="text-gray-600">
                <strong>Max Point:</strong> {topic.maxPoint || "N/A"}
              </p>
              <h4 className="mt-2 font-semibold">Exercises</h4>
              {topic.exercises?.length > 0 ? (
                topic.exercises.map((exercise) => {
                  const content = parseExerciseContent(exercise.content);
                  return (
                    <div
                      key={exercise.id}
                      className={`mt-2 p-2 rounded-md ${
                        content.type === "true_false"
                          ? "bg-blue-50"
                          : content.type === "multiple_choice"
                          ? "bg-yellow-50"
                          : "bg-gray-50"
                      }`}
                    >
                      <p>
                        <strong>Type:</strong> {content.type || "N/A"}
                      </p>
                      <p>
                        <strong>Question:</strong> {content.question || "N/A"}
                      </p>
                      {content.options && content.options.length > 0 && (
                        <p>
                          <strong>Options:</strong> {content.options.join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Answer:</strong> {content.answer || "N/A"}
                      </p>
                      <p>
                        <strong>Explanation:</strong>{" "}
                        {content.explanation || "N/A"}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No exercises available</p>
              )}
            </Panel>
          ))}
        </Collapse>
      ) : (
        <p className="text-gray-500">No topics available</p>
      )}
    </>
  );
};

export default TopicPanel;
