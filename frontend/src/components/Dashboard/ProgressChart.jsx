import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ProgressChart = ({ data }) => {
  const chartData = [
    { name: 'Todo', value: data?.todoTasks || 0, color: '#EF4444' },
    { name: 'In Progress', value: data?.inProgressTasks || 0, color: '#F59E0B' },
    { name: 'Completed', value: data?.completedTasks || 0, color: '#10B981' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Completion Rate: {data?.completionRate?.toFixed(1)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${data?.completionRate || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;