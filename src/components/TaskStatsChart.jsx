import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  todo: "#6A11CB",
  inProgress: "#00c6ff",
  done: "#34D399",
  deleted: "#F87171",
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderLegend = ({ payload }) => (
  <ul className="flex justify-center gap-4 mt-2 flex-wrap">
    {payload.map((entry) => (
      <li key={entry.value} className="flex items-center gap-2 text-sm text-gray-700">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
        {entry.value}
      </li>
    ))}
  </ul>
);

export default function TaskStatsChart({ data }) {
  const chartData = [
    { name: "todo", value: data.todo || 0 },
    { name: "inProgress", value: data.inProgress || 0 },
    { name: "done", value: data.done || 0 },
    ...(data.deleted > 0 ? [{ name: "deleted", value: data.deleted }] : []),
  ];

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-base font-semibold mb-4">Task Statistics</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
