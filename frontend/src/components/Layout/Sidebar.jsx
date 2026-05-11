import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiBriefcase,
  FiCheckSquare,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiUsers,
  FiStar
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, isMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const getNavItems = () => {
    const commonItems = [
      { path: '/', name: 'Dashboard', icon: <FiHome size={20} />, exact: true },
      { path: '/projects', name: 'Projects', icon: <FiBriefcase size={20} /> },
      { path: '/tasks', name: 'Tasks', icon: <FiCheckSquare size={20} /> },
      { path: '/calendar', name: 'Calendar', icon: <FiCalendar size={20} /> }
    ];

    const adminItems = [
      { path: '/team', name: 'Team Members', icon: <FiUsers size={20} /> },
      { path: '/analytics', name: 'Analytics', icon: <FiBarChart2 size={20} /> }
    ];

    const userItems = [
      { path: '/profile', name: 'Profile', icon: <FiUser size={20} /> }
    ];

    let items = [...commonItems];
    if (user?.role === 'admin') items = [...items, ...adminItems];
    items = [...items, ...userItems];

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {!collapsed && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleSidebar}></div>
      )}

      <aside
        className={`fixed left-0 top-16 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-20 ${
          collapsed ? 'w-20' : 'w-64'
        } ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Toggle Button - Hide on mobile */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-gray-700 rounded-full p-1 hover:bg-gray-600 transition-colors z-30"
          >
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        )}

        {/* User Profile Section */}
        <div className={`p-6 border-b border-gray-700 ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 transition-all duration-200
                    ${collapsed ? 'justify-center' : 'space-x-3'}
                    ${isActive
                      ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  title={collapsed ? item.name : ''}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="flex-1">{item.name}</span>}
                  {!collapsed && item.name === 'Tasks' && (
                    <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Storage</span>
                  <span className="text-xs text-gray-400">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-500 rounded-full h-1.5" style={{ width: '65%' }}></div>
                </div>
              </div>

              <NavLink to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <FiSettings size={18} />
                <span className="text-sm">Settings</span>
              </NavLink>
            </div>
          ) : (
            <div className="flex justify-center">
              <NavLink to="/settings" className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors" title="Settings">
                <FiSettings size={20} />
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;