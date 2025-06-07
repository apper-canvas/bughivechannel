import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const Sidebar = ({ routes, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-4 space-y-2">
                {routes.map((route, index) => (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(route.id)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full ${
                      activeTab === route.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
                    }`}
                  >
                    <ApperIcon 
                      name={route.icon} 
                      className={`mr-3 h-5 w-5 transition-colors ${
                        activeTab === route.id
                          ? 'text-white'
                          : 'text-surface-400 group-hover:text-surface-500 dark:group-hover:text-surface-300'
                      }`}
                    />
                    {route.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 lg:hidden"
          >
            <div className="flex flex-col h-full bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-xl">
              <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Bug" className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-surface-900 dark:text-white">
                    BugHive
                  </h1>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                </motion.button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {routes.map((route, index) => (
                  <motion.button
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(route.id);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full ${
                      activeTab === route.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
                    }`}
                  >
                    <ApperIcon 
                      name={route.icon} 
                      className={`mr-3 h-5 w-5 transition-colors ${
                        activeTab === route.id
                          ? 'text-white'
                          : 'text-surface-400 group-hover:text-surface-500 dark:group-hover:text-surface-300'
                      }`}
                    />
                    {route.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;