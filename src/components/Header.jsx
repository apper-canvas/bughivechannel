import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const Header = ({ darkMode, toggleDarkMode, setSidebarOpen }) => {
  return (
    <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 h-16 flex items-center px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
          </motion.button>

          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Bug" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white hidden sm:block">
              BugHive
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ApperIcon name="Search" className="w-4 h-4 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
              className="w-64 pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon 
              name={darkMode ? "Sun" : "Moon"} 
              className="w-5 h-5 text-surface-600 dark:text-surface-300" 
            />
          </motion.button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;