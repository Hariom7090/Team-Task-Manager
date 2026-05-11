import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import {
  FiCalendar, FiClock, FiCheckCircle, FiAlertCircle,
  FiChevronLeft, FiChevronRight, FiList
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, list
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching tasks for calendar...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Ensure tasks is always an array
      const tasksData = Array.isArray(response.data) ? response.data : [];
      console.log('Tasks received:', tasksData.length);

      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to load calendar tasks');
      toast.error('Failed to load calendar tasks');
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    // Safety check - ensure tasks is an array
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    return tasks.filter(task => {
      if (!task || !task.dueDate) return false;
      try {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      } catch (err) {
        console.error('Error parsing date:', task.dueDate);
        return false;
      }
    });
  };

  const getAllTasksSorted = () => {
    if (!tasks || !Array.isArray(tasks)) return [];

    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="flex items-center text-green-600 text-xs"><FiCheckCircle size={12} className="mr-1" /> Completed</span>;
      case 'in_progress':
        return <span className="text-blue-600 text-xs">In Progress</span>;
      default:
        return <span className="text-gray-500 text-xs">To Do</span>;
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate) return false;
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add weekday headers
    weekdays.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="text-center font-semibold text-gray-600 py-2 md:py-3 text-xs md:text-sm border-b">
          {day}
        </div>
      );
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[120px] p-1 md:p-2 border bg-gray-50"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border cursor-pointer transition-all duration-200 overflow-y-auto ${
            isSelected ? 'bg-blue-50 border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
          } ${isToday ? 'bg-yellow-50' : 'bg-white'}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
            {isToday && <span className="ml-1 text-xs text-blue-600 hidden md:inline">(Today)</span>}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-[10px] md:text-xs px-1 py-0.5 rounded truncate ${getPriorityColor(task.priority)}`}
                title={task.title}
              >
                {task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-[10px] md:text-xs text-gray-500 text-center">
                +{dayTasks.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const allTasksSorted = getAllTasksSorted();
  const upcomingTasks = allTasksSorted.filter(task =>
    task.status !== 'completed' && task.dueDate && new Date(task.dueDate) >= new Date()
  ).slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4">
              <FiAlertCircle size={48} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load calendar</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchTasks}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Task Calendar</h1>
              <p className="text-gray-600 mt-1">View and manage tasks by due date</p>
              <p className="text-sm text-gray-500 mt-1">Total tasks: {tasks.length}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'month' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0 md:gap-1">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Tasks for Selected Date */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-20">
                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center space-x-2">
                  <FiCalendar size={20} className="text-blue-600" />
                  <span className="text-sm md:text-base">
                    {selectedDate ? selectedDate.toLocaleDateString('default', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Select a date'}
                  </span>
                </h2>

                {!selectedDateTasks || selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-gray-500">
                    <FiCalendar size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>No tasks scheduled for this day</p>
                    <p className="text-xs md:text-sm mt-2">Click on any date to view tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {selectedDateTasks.map(task => (
                      <div key={task.id} className="p-3 md:p-4 border rounded-lg hover:shadow-md transition-all">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{task.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                          {task.description || 'No description'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {getStatusBadge(task.status)}
                          {isOverdue(task.dueDate, task.status) && (
                            <span className="flex items-center text-red-600 text-xs">
                              <FiAlertCircle size={12} className="mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>Project: {task.project?.title || 'N/A'}</div>
                          <div>Assignee: {task.assignee?.name || 'Unassigned'}</div>
                          {task.dueDate && (
                            <div className="flex items-center mt-1">
                              <FiClock size={12} className="mr-1" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <h2 className="text-lg md:text-xl font-semibold flex items-center space-x-2">
                <FiList size={20} className="text-blue-600" />
                <span>All Tasks (Sorted by Due Date)</span>
              </h2>
            </div>
            <div className="divide-y">
              {allTasksSorted.length === 0 ? (
                <div className="text-center py-12">
                  <FiCalendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No tasks found</p>
                  <p className="text-sm text-gray-400 mt-2">Create tasks to see them here</p>
                </div>
              ) : (
                allTasksSorted.map(task => (
                  <div key={task.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <h3 className="font-semibold text-gray-800">{task.title}</h3>
                          {task.status === 'completed' && (
                            <FiCheckCircle className="text-green-500" size={16} />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {getStatusBadge(task.status)}
                          {isOverdue(task.dueDate, task.status) && (
                            <span className="flex items-center text-red-600 text-xs">
                              <FiAlertCircle size={12} className="mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                          <span>Project: {task.project?.title || 'N/A'}</span>
                          <span>Assignee: {task.assignee?.name || 'Unassigned'}</span>
                          {task.dueDate && (
                            <span className="flex items-center">
                              <FiClock size={12} className="mr-1" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Upcoming Tasks Widget */}
        {upcomingTasks.length > 0 && viewMode === 'month' && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center space-x-2">
              <FiClock size={20} className="text-blue-600" />
              <span>Upcoming Tasks</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-lg hover:shadow-md transition-all">
                  <h3 className="font-medium text-gray-800 text-sm">{task.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </p>
                  <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;