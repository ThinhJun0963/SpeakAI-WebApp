import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader } from "@mui/material";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const LearningCharts = ({ courses }) => {
  const [activeChart, setActiveChart] = useState(null);

  // Process data for charts
  const coursesByMonth = courses.reduce((acc, course) => {
    const month = new Date(course.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const courseCreationData = Object.entries(coursesByMonth).map(
    ([month, count]) => ({
      month,
      courses: count,
    })
  );

  const coursesByLevel = courses.reduce((acc, course) => {
    const level = `Level ${course.levelId}`;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  const levelDistributionData = Object.entries(coursesByLevel).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const premiumVsFreeData = [
    { name: "Premium", value: courses.filter((c) => c.isPremium).length },
    { name: "Free", value: courses.filter((c) => !c.isPremium).length },
  ];

  const maxPointDistribution = courses.reduce((acc, course) => {
    const range = Math.floor(course.maxPoint / 100) * 100;
    const label = `${range}-${range + 99}`;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const pointDistributionData = Object.entries(maxPointDistribution).map(
    ([range, count]) => ({
      range,
      courses: count,
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Course Creation Over Time */}
      <Card>
        <CardHeader>Courses Created by Month</CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courseCreationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="courses"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Level Distribution */}
      <Card>
        <CardHeader>Course Level Distribution</CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {levelDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Premium vs Free */}
      <Card>
        <CardHeader>Premium vs Free Courses</CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={premiumVsFreeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {premiumVsFreeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Max Point Distribution */}
      <Card>
        <CardHeader>Max Point Distribution</CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pointDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="courses" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningCharts;
