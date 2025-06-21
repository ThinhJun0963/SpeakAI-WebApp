import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const ChartComponent = ({
  data,
  type,
  dataKey,
  nameKey,
  color,
  colors,
  innerRadius,
}) => {
  const commonProps = { data, width: "100%", height: "100%" };

  if (type === "line") {
    return (
      <ResponsiveContainer {...commonProps}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (type === "pie") {
    return (
      <ResponsiveContainer {...commonProps}>
        <PieChart>
          <Pie
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
            innerRadius={innerRadius}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (type === "bar") {
    return (
      <ResponsiveContainer {...commonProps}>
        <BarChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return null;
};

export default ChartComponent;
