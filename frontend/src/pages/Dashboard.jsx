import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { FiCheckCircle, FiClock, FiAlertCircle, FiBriefcase, FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading dashboard...</div></Layout>;

  const stats = [
    { title: 'Total Tasks', value: data?.totalTasks || 0, icon: <FiCheckCircle size={24} />, color: 'bg-blue-500' },
    { title: 'In Progress', value: data?.inProgressTasks || 0, icon: <FiClock size={24} />, color: 'bg-yellow-500' },
    { title: 'Completed', value: data?.completedTasks || 0, icon: <FiCheckCircle size={24} />, color: 'bg-green-500' },
    { title: 'Overdue', value: data?.overdueTasks || 0, icon: <FiAlertCircle size={24} />, color: 'bg-red-500' }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1"><span>To Do</span><span>{data?.todoTasks || 0}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-gray-500 rounded-full h-2" style={{ width: `${((data?.todoTasks || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span>In Progress</span><span>{data?.inProgressTasks || 0}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 rounded-full h-2" style={{ width: `${((data?.inProgressTasks || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span>Completed</span><span>{data?.completedTasks || 0}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: `${((data?.completedTasks || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Completion Rate: {data?.completionRate?.toFixed(1) || 0}%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Priority Distribution</h2>
            <div className="space-y-4">
              <div><div className="flex justify-between"><span>High</span><span>{data?.highPriority || 0}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 rounded-full h-2" style={{ width: `${((data?.highPriority || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div></div>
              <div><div className="flex justify-between"><span>Medium</span><span>{data?.mediumPriority || 0}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 rounded-full h-2" style={{ width: `${((data?.mediumPriority || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div></div>
              <div><div className="flex justify-between"><span>Low</span><span>{data?.lowPriority || 0}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 rounded-full h-2" style={{ width: `${((data?.lowPriority || 0) / (data?.totalTasks || 1)) * 100}%` }}></div></div></div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <div className="space-y-3">
            {data?.tasksPerUser?.map((member, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{member.name}</span>
                <span>{member.count} tasks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs">Task</th><th className="px-6 py-3 text-left text-xs">Project</th><th className="px-6 py-3 text-left text-xs">Assignee</th><th className="px-6 py-3 text-left text-xs">Status</th><th className="px-6 py-3 text-left text-xs">Due Date</th></tr></thead>
              <tbody>
                {data?.recentTasks?.map((task, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{task.title}</td>
                    <td className="px-6 py-4">{task.project}</td>
                    <td className="px-6 py-4">{task.assignee}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.status}</span></td>
                    <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;