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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

// Dữ liệu phiên học theo tháng
const sessionData = [
  { month: "Jan", sessions: 65, minutes: 325 },
  { month: "Feb", sessions: 78, minutes: 390 },
  { month: "Mar", sessions: 95, minutes: 475 },
  { month: "Apr", sessions: 110, minutes: 550 },
  { month: "May", sessions: 88, minutes: 440 },
  { month: "Jun", sessions: 102, minutes: 510 },
];

// Dữ liệu chủ đề luyện nói
const topicData = [
  { name: "Giao tiếp cơ bản", value: 150 },
  { name: "Phỏng vấn việc làm", value: 120 },
  { name: "Du lịch & nhà hàng", value: 85 },
  { name: "Thuyết trình", value: 45 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const LearningCharts = () => {
  const [activeChart, setActiveChart] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <Card
        className={`overflow-hidden transition-all duration-300 border border-gray-200 ${
          activeChart === "line"
            ? "shadow-lg transform translate-y-[-4px]"
            : "shadow-sm"
        }`}
        onMouseEnter={() => setActiveChart("line")}
        onMouseLeave={() => setActiveChart(null)}
      >
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Phiên luyện nói theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 pt-4 pb-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sessionData}
                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#e0e0e0" }}
                  tick={{ fill: "#666", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "sessions"
                      ? "Số phiên luyện nói"
                      : "Số phút luyện tập",
                  ]}
                  labelFormatter={(label) => `Tháng: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name="Số phiên luyện nói"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "white",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`overflow-hidden transition-all duration-300 border border-gray-200 ${
          activeChart === "pie"
            ? "shadow-lg transform translate-y-[-4px]"
            : "shadow-sm"
        }`}
        onMouseEnter={() => setActiveChart("pie")}
        onMouseLeave={() => setActiveChart(null)}
      >
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Chủ đề luyện nói phổ biến
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 pt-4 pb-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{
                    stroke: "#555",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                >
                  {topicData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-opacity duration-300 hover:opacity-90"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value} phiên`, "Số lượng"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => (
                    <span className="text-sm text-gray-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningCharts;
