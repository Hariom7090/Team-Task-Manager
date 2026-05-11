import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import {
  FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle,
  FiBarChart2, FiUsers, FiCalendar, FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0,
    tasksPerUser: [],
    recentTasks: [],
    tasksDueThisWeek: 0,
    totalTeamMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching analytics data...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Analytics data received:', response.data);

      // Safely extract data with defaults
      const data = response.data || {};

      setDashboardData({
        totalTasks: typeof data.totalTasks === 'number' ? data.totalTasks : 0,
        todoTasks: typeof data.todoTasks === 'number' ? data.todoTasks : 0,
        inProgressTasks: typeof data.inProgressTasks === 'number' ? data.inProgressTasks : 0,
        completedTasks: typeof data.completedTasks === 'number' ? data.completedTasks : 0,
        overdueTasks: typeof data.overdueTasks === 'number' ? data.overdueTasks : 0,
        totalProjects: typeof data.totalProjects === 'number' ? data.totalProjects : 0,
        highPriority: typeof data.highPriority === 'number' ? data.highPriority : 0,
        mediumPriority: typeof data.mediumPriority === 'number' ? data.mediumPriority : 0,
        lowPriority: typeof data.lowPriority === 'number' ? data.lowPriority : 0,
        completionRate: typeof data.completionRate === 'number' ? data.completionRate : 0,
        tasksPerUser: Array.isArray(data.tasksPerUser) ? data.tasksPerUser : [],
        recentTasks: Array.isArray(data.recentTasks) ? data.recentTasks : [],
        tasksDueThisWeek: typeof data.tasksDueThisWeek === 'number' ? data.tasksDueThisWeek : 0,
        totalTeamMembers: typeof data.totalTeamMembers === 'number' ? data.totalTeamMembers : 1
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Failed to load analytics data');
      toast.error('Failed to load analytics data');

      // Keep default values on error
      setDashboardData(prev => ({ ...prev }));
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return (value / total) * 100;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && dashboardData.totalTasks === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4">
              <FiAlertCircle size={48} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load analytics</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    totalTasks, todoTasks, inProgressTasks, completedTasks, overdueTasks,
    totalProjects, highPriority, mediumPriority, lowPriority, completionRate,
    tasksPerUser, recentTasks, tasksDueThisWeek, totalTeamMembers
  } = dashboardData;

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your team's performance</p>
          {totalTasks === 0 && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-blue-800 text-sm flex items-center">
                <FiActivity className="mr-2" />
                ℹ️ Create some tasks to see analytics data
              </p>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Completion Rate Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiTrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalTasks}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiCheckCircle size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs md:text-sm">
              <span className="text-green-600">{completedTasks} completed</span>
              {' • '}
              <span className="text-yellow-600">{inProgressTasks} in progress</span>
              {' • '}
              <span className="text-gray-600">{todoTasks} todo</span>
            </div>
          </div>

          {/* Overdue Tasks Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Overdue Tasks</p>
                <p className="text-2xl md:text-3xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiAlertCircle size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Tasks past due date</p>
          </div>

          {/* Active Projects Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl md:text-3xl font-bold text-purple-600">{totalProjects}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiBarChart2 size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Tasks Due This Week</p>
                <p className="text-3xl font-bold">{tasksDueThisWeek}</p>
              </div>
              <FiCalendar size={32} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Team Members</p>
                <p className="text-3xl font-bold">{totalTeamMembers}</p>
              </div>
              <FiUsers size={32} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Priority Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Tasks by Priority</h2>
            {totalTasks === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No data available</p>
                <p className="text-sm mt-2">Create tasks to see priority distribution</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">High Priority</span>
                    <span className="text-sm text-gray-600">{highPriority}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(highPriority, totalTasks)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Medium Priority</span>
                    <span className="text-sm text-gray-600">{mediumPriority}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(mediumPriority, totalTasks)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Low Priority</span>
                    <span className="text-sm text-gray-600">{lowPriority}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(lowPriority, totalTasks)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Task Status</h2>
            {totalTasks === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No data available</p>
                <p className="text-sm mt-2">Create tasks to see status distribution</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">To Do</span>
                    <span className="text-sm text-gray-600">{todoTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(todoTasks, totalTasks)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">In Progress</span>
                    <span className="text-sm text-gray-600">{inProgressTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(inProgressTasks, totalTasks)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-gray-600">{completedTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${calculatePercentage(completedTasks, totalTasks)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Team Performance Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <h2 className="text-lg md:text-xl font-semibold flex items-center space-x-2">
              <FiUsers size={20} className="text-blue-600" />
              <span>Team Performance</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            {!tasksPerUser || tasksPerUser.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No team performance data available yet</p>
                <p className="text-sm text-gray-400 mt-2">Create and assign tasks to see team analytics</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasks Assigned
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasksPerUser.map((member, index) => {
                    const taskCount = member.count || 0;
                    const completedCount = member.completed || 0;
                    const memberProgress = taskCount === 0 ? 0 : (completedCount / taskCount) * 100;

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                              {member.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="ml-3 font-medium text-gray-900">{member.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-600">
                          {taskCount}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-green-600">
                          {completedCount}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 w-24 md:w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                                style={{ width: `${memberProgress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {memberProgress.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        {recentTasks && recentTasks.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <h2 className="text-lg md:text-xl font-semibold flex items-center space-x-2">
                <FiClock size={20} className="text-blue-600" />
                <span>Recent Activity</span>
              </h2>
            </div>
            <div className="divide-y">
              {recentTasks.slice(0, 5).map((task, index) => (
                <div key={index} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.project} • Assigned to {task.assignee}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;