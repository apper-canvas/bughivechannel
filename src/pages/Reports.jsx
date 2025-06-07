import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { issueService } from '../services';

const Reports = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getAll();
      setIssues(result);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      new: 0,
      'in-progress': 0,
      testing: 0,
      resolved: 0,
      closed: 0
    };
    
    issues.forEach(issue => {
      counts[issue.status] = (counts[issue.status] || 0) + 1;
    });
    
    return counts;
  };

  const getSeverityCounts = () => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    issues.forEach(issue => {
      counts[issue.severity] = (counts[issue.severity] || 0) + 1;
    });
    
    return counts;
  };

  const getCategoryCounts = () => {
    const counts = {};
    issues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    return counts;
  };

  const getAssigneeCounts = () => {
    const counts = {};
    issues.forEach(issue => {
      const assignee = issue.assignee || 'Unassigned';
      counts[assignee] = (counts[assignee] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const severityCounts = getSeverityCounts();
  const categoryCounts = getCategoryCounts();
  const assigneeCounts = getAssigneeCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 dark:bg-surface-600 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 dark:bg-surface-600 rounded"></div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-600 rounded w-2/3"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-card"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
          Error Loading Reports
        </h3>
        <p className="text-surface-500 dark:text-surface-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadIssues}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Issue Reports
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Analytics and insights about your project's bug tracking performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Issues', 
            value: issues.length, 
            icon: 'Bug', 
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800'
          },
          { 
            label: 'Open Issues', 
            value: issues.filter(i => !['resolved', 'closed'].includes(i.status)).length, 
            icon: 'AlertCircle', 
            color: 'text-red-600',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800'
          },
          { 
            label: 'Resolved Today', 
            value: issues.filter(i => {
              const today = new Date().toDateString();
              return i.status === 'resolved' && new Date(i.updatedAt).toDateString() === today;
            }).length, 
            icon: 'CheckCircle', 
            color: 'text-green-600',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800'
          },
          { 
            label: 'Critical Issues', 
            value: issues.filter(i => i.severity === 'critical' && !['resolved', 'closed'].includes(i.status)).length, 
            icon: 'AlertTriangle', 
            color: 'text-orange-600',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-200 dark:border-orange-800'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} border ${stat.border} rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              </div>
              <ApperIcon name={stat.icon} className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Issues by Status
            </h3>
            <ApperIcon name="BarChart3" className="w-5 h-5 text-surface-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
              const colors = {
                new: 'bg-blue-500',
                'in-progress': 'bg-purple-500',
                testing: 'bg-yellow-500',
                resolved: 'bg-green-500',
                closed: 'bg-gray-500'
              };
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">
                      {status.replace('-', ' ')}
                    </span>
                    <span className="text-surface-500 dark:text-surface-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-2 rounded-full ${colors[status]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Issues by Severity
            </h3>
            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-surface-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(severityCounts).map(([severity, count]) => {
              const percentage = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
              const colors = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500'
              };
              
              return (
                <div key={severity} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">
                      {severity}
                    </span>
                    <span className="text-surface-500 dark:text-surface-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-2 rounded-full ${colors[severity]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Issues by Category
            </h3>
            <ApperIcon name="Tag" className="w-5 h-5 text-surface-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                <span className="font-medium text-surface-700 dark:text-surface-300">
                  {category}
                </span>
                <span className="px-2 py-1 bg-primary text-white text-sm rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Issues by Assignee
            </h3>
            <ApperIcon name="Users" className="w-5 h-5 text-surface-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(assigneeCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([assignee, count]) => (
              <div key={assignee} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {assignee === 'Unassigned' ? '?' : assignee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-medium text-surface-700 dark:text-surface-300">
                    {assignee}
                  </span>
                </div>
                <span className="px-2 py-1 bg-accent text-white text-sm rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Quick Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 dark:bg-surface-800/50 rounded-lg p-3">
                <div className="font-medium text-surface-900 dark:text-white">Resolution Rate</div>
                <div className="text-surface-600 dark:text-surface-400">
                  {issues.length > 0 ? Math.round((statusCounts.resolved / issues.length) * 100) : 0}% of issues resolved
                </div>
              </div>
              <div className="bg-white/50 dark:bg-surface-800/50 rounded-lg p-3">
                <div className="font-medium text-surface-900 dark:text-white">Most Common</div>
                <div className="text-surface-600 dark:text-surface-400">
                  {Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data'} category
                </div>
              </div>
              <div className="bg-white/50 dark:bg-surface-800/50 rounded-lg p-3">
                <div className="font-medium text-surface-900 dark:text-white">Workload</div>
                <div className="text-surface-600 dark:text-surface-400">
                  {assigneeCounts.Unassigned || 0} unassigned issues
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;