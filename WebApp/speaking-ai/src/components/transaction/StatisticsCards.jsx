import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { motion } from "framer-motion";

const StatisticsCards = ({
  totalRevenue,
  pendingCount,
  completedCount,
  loading,
}) => {
  if (loading) {
    return (
      <Row gutter={[16, 16]} className="mb-6">
        {[...Array(3)].map((_, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card>
              <Skeleton active paragraph={false} title={{ width: "50%" }} />
              <Skeleton active paragraph={false} title={{ width: "30%" }} />
            </Card>
          </Col>
        ))}
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
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Revenue (VND)"
              value={totalRevenue}
              precision={1}
              prefix="₫"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Pending Transactions"
              value={pendingCount}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Completed Transactions"
              value={completedCount}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default StatisticsCards;
