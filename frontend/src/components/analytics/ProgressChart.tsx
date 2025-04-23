import React from 'react';
import { useAppSelector } from '@/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ProgressChart: React.FC = () => {
  const { progress } = useAppSelector((state) => state.analytics);

  // Mock data for demonstration - in real app, this would come from the backend
  const data = [
    { date: 'Jan', score: 60, interviews: 2 },
    { date: 'Feb', score: 65, interviews: 3 },
    { date: 'Mar', score: 70, interviews: 4 },
    { date: 'Apr', score: 75, interviews: 5 },
    { date: 'May', score: 80, interviews: 6 },
    { date: 'Jun', score: 85, interviews: 7 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              name="Average Score"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="interviews"
              stroke="#82ca9d"
              name="Interviews"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart; 