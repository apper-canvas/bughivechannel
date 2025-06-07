import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import CommentInput from '@/components/molecules/CommentInput';
import CommentItem from '@/components/molecules/CommentItem';
import commentService from '@/services/api/commentService';

const CommentThread = ({ issueId, currentUserId = 1 }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  
  const commentsPerPage = 10;

  useEffect(() => {
    loadComments();
  }, [issueId, sortBy]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getByIssueId(issueId);
      
      // Sort comments
      const sortedComments = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      setComments(sortedComments);
    } catch (err) {
      setError('Failed to load comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      setIsSubmitting(true);
      const newComment = await commentService.create({
        issueId,
        userId: currentUserId,
        userName: 'Current User', // In real app, get from auth context
        userEmail: 'current.user@example.com',
        content
      });
      
      // Add to local state
      if (sortBy === 'newest') {
        setComments(prev => [newComment, ...prev]);
      } else {
        setComments(prev => [...prev, newComment]);
      }
      
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      setIsSubmitting(true);
      const newReply = await commentService.reply(parentId, {
        userId: currentUserId,
        userName: 'Current User',
        userEmail: 'current.user@example.com',
        content
      });
      
      // Update local state - find parent and add reply
      setComments(prev => {
        const updateReplies = (comments) => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateReplies(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateReplies(prev);
      });
      
      toast.success('Reply added successfully');
    } catch (err) {
      toast.error('Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      setIsSubmitting(true);
      await commentService.update(commentId, { content });
      
      // Update local state
      setComments(prev => {
        const updateComment = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                content,
                updatedAt: new Date().toISOString(),
                isEdited: true
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComment(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateComment(prev);
      });
      
      toast.success('Comment updated successfully');
    } catch (err) {
      toast.error('Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setIsSubmitting(true);
      await commentService.delete(commentId);
      
      // Remove from local state
      setComments(prev => {
        const removeComment = (comments) => {
          return comments.filter(comment => {
            if (comment.id === commentId) {
              return false;
            }
            if (comment.replies) {
              comment.replies = removeComment(comment.replies);
            }
            return true;
          });
        };
        return removeComment(prev);
      });
      
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalComments = comments.reduce((count, comment) => {
    const countReplies = (comment) => {
      let total = 1;
      if (comment.replies) {
        comment.replies.forEach(reply => {
          total += countReplies(reply);
        });
      }
      return total;
    };
    return count + countReplies(comment);
  }, 0);

  const paginatedComments = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <Text as="span" className="ml-2 text-surface-600">Loading comments...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Icon name="AlertCircle" size={24} className="text-red-500 mx-auto mb-2" />
        <Text as="p" className="text-red-600 mb-4">{error}</Text>
        <Button onClick={loadComments} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white">
          Comments ({totalComments})
        </Text>
        
        <div className="flex items-center space-x-2">
          <Text as="span" className="text-sm text-surface-500">Sort by:</Text>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-surface-200 dark:border-surface-600 rounded px-2 py-1 bg-white dark:bg-surface-700"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Comment Input */}
      <CommentInput
        onSubmit={handleAddComment}
        placeholder="Share your thoughts on this issue..."
        isLoading={isSubmitting}
      />

      {/* Comments List */}
      <AnimatePresence mode="wait">
        {comments.length === 0 ? (
          <motion.div
            key="no-comments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Icon name="MessageCircle" size={48} className="text-surface-300 mx-auto mb-4" />
            <Text as="h4" className="text-lg font-medium text-surface-600 mb-2">
              No comments yet
            </Text>
            <Text as="p" className="text-surface-500">
              Be the first to share your thoughts on this issue.
            </Text>
          </motion.div>
        ) : (
          <motion.div
            key="comments-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {paginatedComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserId}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isLoading={isSubmitting}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-surface-200 dark:border-surface-700">
          <Text as="span" className="text-sm text-surface-500">
            Showing {(currentPage - 1) * commentsPerPage + 1} to {Math.min(currentPage * commentsPerPage, comments.length)} of {comments.length} comments
          </Text>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
              Previous
            </Button>
            
            <Text as="span" className="text-sm text-surface-600 px-4">
              Page {currentPage} of {totalPages}
            </Text>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentThread;