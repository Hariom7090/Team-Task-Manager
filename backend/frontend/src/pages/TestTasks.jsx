import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';

const TestTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API Response:', response.data);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Test Tasks Page</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Tasks Page</h1>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Debug Info:</strong></p>
          <p>Tasks Count: {tasks.length}</p>
          <p>Error: {error || 'None'}</p>
          <button
            onClick={fetchTasks}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Refresh
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-yellow-100 p-4 rounded">
            <p className="font-bold">No tasks found!</p>
            <p className="mt-2">Check your database or create a task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <div className="mt-2 text-sm">
                  <span>Priority: {task.priority}</span>
                  <span className="ml-4">Status: {task.status}</span>
                  <span className="ml-4">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestTasks;