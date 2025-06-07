import React from "react";
import { Card, CardHeader, CardContent } from "@mui/material";
import useDashboardData from "../../hooks/useDashboardData";
import ChartComponent from "./ChartComponent";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const LearningCharts = () => {
  const { courses, processData, loading } = useDashboardData();

  if (loading) return <div>Loading...</div>;

  const chartData = [
    {
      title: "Courses Created by Month",
      data: processData.coursesByMonth(),
      type: "line",
      dataKey: "courses",
      color: "#3b82f6",
    },
    {
      title: "Course Level Distribution",
      data: processData.coursesByLevel(),
      type: "pie",
      dataKey: "value",
      nameKey: "name",
      colors: COLORS,
    },
    {
      title: "Premium vs Free Courses",
      data: processData.premiumVsFree(),
      type: "pie",
      dataKey: "value",
      nameKey: "name",
      colors: COLORS,
      innerRadius: 60,
    },
    {
      title: "Max Point Distribution",
      data: processData.maxPointDistribution(),
      type: "bar",
      dataKey: "courses",
      color: "#10B981",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {chartData.map((chart, index) => (
        <Card key={index}>
          <CardHeader title={chart.title} />
          <CardContent>
            <div className="h-80">
              <ChartComponent {...chart} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LearningCharts;
