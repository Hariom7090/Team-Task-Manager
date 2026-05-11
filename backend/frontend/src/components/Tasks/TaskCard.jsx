import React from 'react';
import { FiEdit2, FiTrash2, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdmin }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
        </div>
        {(isAdmin || task.assignedTo === task.currentUser?.id) && (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800">
              <FiEdit2 size={18} />
            </button>
            {isAdmin && (
              <button onClick={() => onDelete(task.id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority} priority
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status === 'in_progress' ? 'In Progress' : task.status}
        </span>
        {isOverdue && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Overdue
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <FiClock size={14} className="mr-1" />
            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="text-gray-500">
            Assignee: {task.assignee?.name || 'Unassigned'}
          </div>
        </div>

        {(isAdmin || task.assignedTo === task.currentUser?.id) && task.status !== 'completed' && (
          <div className="mt-3">
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiCheckCircle size={16} />
              <span>Mark as Complete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;