import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <Sidebar isCollapsed={sidebarCollapsed} isMobile={isMobile} />
      <main
        className={`transition-all duration-300 pt-16 ${
          !isMobile && (sidebarCollapsed ? 'ml-20' : 'ml-64')
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;