import React from "react";
import { Card, Row, Col } from "antd";
import { Pie, Line } from "@ant-design/plots";
import { motion } from "framer-motion";

const Charts = ({ statusChartData, revenueChartData, loading }) => {
  if (loading) {
    return (
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Status Distribution">
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Revenue Over Time (VND)">
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Status Distribution">
            {statusChartData.length > 0 ? (
              <Pie
                data={statusChartData}
                angleField="value"
                colorField="type"
                color={({ type }) =>
                  type === "Paid"
                    ? "#52c41a"
                    : type === "Pending"
                    ? "#faad14"
                    : type === "Failed"
                    ? "#ff4d4f"
                    : "#d9d9d9"
                }
                radius={0.8}
                innerRadius={0.6}
                label={{
                  offset: -20,
                  content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                  style: { fontSize: 14, textAlign: "center", fill: "#fff" },
                }}
                statistic={{
                  title: { content: "Transactions", style: { fontSize: 16 } },
                  content: { style: { fontSize: 20 } },
                }}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">
                No data available.
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Revenue Over Time (VND)">
            {revenueChartData.length > 0 ? (
              <Line
                data={revenueChartData}
                xField="date"
                yField="amount"
                yAxis={{ label: { formatter: (v) => `${v}` } }}
                point={{
                  size: 5,
                  shape: "diamond",
                  style: { fill: "#1890ff" },
                }}
                lineStyle={{ stroke: "#1890ff", lineWidth: 2 }}
                tooltip={{
                  formatter: (datum) => ({
                    name: "Revenue",
                    value: `${datum.amount} VND`,
                  }),
                }}
                smooth
              />
            ) : (
              <div className="text-center py-4 text-gray-500">
                No data available.
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Charts;
