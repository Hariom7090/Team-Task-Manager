import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { FiPlus, FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiBriefcase, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // Always initialize as array
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '',
    assignedTo: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await fetchTasks();
    await fetchProjects();
    await fetchUsers();
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching tasks...');

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Tasks response:', response.data);
      console.log('Is array:', Array.isArray(response.data));

      // Ensure tasks is always an array
      const tasksData = Array.isArray(response.data) ? response.data : [];
      setTasks(tasksData);
      console.log('Tasks set:', tasksData.length);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjects(response.data.projects || []);

  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

 const fetchUsers = async () => {
   try {
     const token = localStorage.getItem("token");

     const response = await axios.get(
       `${import.meta.env.VITE_API_URL}/api/users`,
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
     );

     setUsers(response.data.users || []);

   } catch (error) {
     console.error("Error fetching users:", error);
   }
 };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Due date is required');
      return;
    }
    if (!formData.projectId) {
      toast.error('Please select a project');
      return;
    }
    if (!formData.assignedTo) {
      toast.error('Please assign the task to someone');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Creating task:', formData);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Task created:', response.data);

      // Add new task to the beginning of the array
      setTasks(prevTasks => [response.data, ...prevTasks]);

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        projectId: '',
        assignedTo: ''
      });
      setShowCreateModal(false);
      toast.success('Task created successfully!');

    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const token = localStorage.getItem('token');
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
        ...task,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? response.data : t));
      toast.success(`Task marked as ${newStatus}`);

    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');

    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Safe filtering - ensure tasks is an array
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchTerm && !task.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) : [];

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
            <p className="text-sm text-gray-500 mt-1">Total Tasks: {tasks.length}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiPlus size={20} />
              <span>New Task</span>
            </button>
          )}
        </div>

        {/* Debug Info - Shows what's in state */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium mb-2">Debug Information:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>Tasks in State: <strong>{tasks.length}</strong></div>
            <div>Filtered Tasks: <strong>{filteredTasks.length}</strong></div>
            <div>Projects: <strong>{projects.length}</strong></div>
            <div>Users: <strong>{users.length}</strong></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            ℹ️ Tasks is {Array.isArray(tasks) ? 'an array' : 'NOT an array'} | Type: {typeof tasks}
          </p>
          {tasks.length === 0 && (
            <p className="text-red-600 text-sm mt-2">
              ⚠️ No tasks found. Click "New Task" to create one.
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterPriority('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiCheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {tasks.length === 0
                ? 'Create your first task using the "New Task" button'
                : 'No tasks match your filters. Try adjusting them.'}
            </p>
            {tasks.length === 0 && isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{task.description || 'No description'}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.status === 'in_progress' ? 'IN PROGRESS' : (task.status?.toUpperCase() || 'TODO')}
                      </span>
                      {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiBriefcase size={14} />
                        {task.project?.title || 'No Project'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers size={14} />
                        {task.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'todo' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in_progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Start
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg">
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <p className="text-blue-100 text-sm">Fill in the task details</p>
              </div>
              <form onSubmit={handleCreateTask} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select a Project --</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                  {projects.length === 0 && (
                    <p className="text-red-500 text-xs mt-1">No projects available. Please create a project first.</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select a User --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;