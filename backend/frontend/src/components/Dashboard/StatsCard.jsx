import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, trend, trendValue, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="dashboard-card group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">
            {title}
          </p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-3xl font-bold mt-2 gradient-text"
          >
            {value}
          </motion.p>
          {trend && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={`text-xs mt-2 flex items-center space-x-1 ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span className="text-lg">
                {trend === 'up' ? '↑' : '↓'}
              </span>
              <span>{trendValue} from last month</span>
            </motion.p>
          )}
        </div>
        <motion.div
          className={`${color} p-3 rounded-2xl stat-icon`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Animated border on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl"
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StatsCard;