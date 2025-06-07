import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { issueService } from '../services';

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = 'John Doe'; // In a real app, this would come from auth context

  useEffect(() => {
    loadMyIssues();
  }, []);

  const loadMyIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getAll();
      // Filter issues assigned to current user or reported by current user
      const myIssues = result.filter(issue => 
        issue.assignee === currentUser || issue.reporter === currentUser
      );
      setIssues(myIssues);
    } catch (err) {
      setError(err.message || 'Failed to load your issues');
      toast.error('Failed to load your issues');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      const updatedIssue = await issueService.update(issueId, { status: newStatus });
      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      ));
      toast.success(`Issue status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update issue status');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      testing: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.new;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 dark:bg-surface-600 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="animate-pulse"
              >
                <div className="flex items-center space-x-4 p-4 border border-surface-200 dark:border-surface-600 rounded-lg">
                  <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/4"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/3"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/4"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/6"></div>
                </div>
              </motion.div>
            ))}
          </div>
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
          Error Loading Your Issues
        </h3>
        <p className="text-surface-500 dark:text-surface-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadMyIssues}
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
          My Issues
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Issues assigned to you or reported by you
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: 'Assigned to Me', 
            value: issues.filter(i => i.assignee === currentUser).length, 
            icon: 'UserCheck', 
            color: 'text-blue-600' 
          },
          { 
            label: 'Reported by Me', 
            value: issues.filter(i => i.reporter === currentUser).length, 
            icon: 'FileText', 
            color: 'text-purple-600' 
          },
          { 
            label: 'Active Issues', 
            value: issues.filter(i => !['resolved', 'closed'].includes(i.status)).length, 
            icon: 'Activity', 
            color: 'text-orange-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-300"
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

      {/* Issues List */}
      {issues.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-card"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="User" className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No issues assigned</h3>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            You don't have any issues assigned to you or reported by you yet
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-600">
                {issues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-surface-900 dark:text-white">
                          {issue.title}
                        </div>
                        <div className="text-sm text-surface-500 dark:text-surface-400 truncate max-w-xs">
                          {issue.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {issue.assignee === currentUser && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            <ApperIcon name="UserCheck" className="w-3 h-3 mr-1" />
                            Assignee
                          </span>
                        )}
                        {issue.reporter === currentUser && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            <ApperIcon name="FileText" className="w-3 h-3 mr-1" />
                            Reporter
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {issue.assignee === currentUser && (
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="testing">Testing</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyIssues;