import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const ProjectCard = ({ project, onDelete, isAdmin }) => {
  const taskCount = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0;
  const progress = taskCount === 0 ? 0 : (completedTasks / taskCount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/projects/${project.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
          </Link>
          {isAdmin && (
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                <FiEdit2 size={18} />
              </button>
              <button onClick={() => onDelete(project.id)} className="text-red-600 hover:text-red-800">
                <FiTrash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || 'No description provided'}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <FiUsers size={16} className="mr-1" />
              <span>{project.members?.length || 1} members</span>
            </div>
            <div className="flex items-center text-gray-500">
              <FiCalendar size={16} className="mr-1" />
              <span>{format(new Date(project.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 pt-2">
            <span>{taskCount} total tasks</span>
            <span>{completedTasks} completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;