import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Issue Tracker
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Manage and track bugs efficiently across your development projects
        </p>
      </div>
      
      <MainFeature />
    </motion.div>
  );
};

export default Home;