import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
        >
          <ApperIcon name="Bug" className="w-24 h-24 text-primary mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-surface-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-6">
          Page Not Found
        </h2>
        
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Looks like this page has gone missing. Even our best bug hunters couldn't track it down!
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotFound;