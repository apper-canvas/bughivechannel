import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Icon from '@/components/atoms/Icon';
import CommentInput from '@/components/molecules/CommentInput';

const CommentItem = ({ 
  comment, 
  currentUserId = 1, // Mock current user
  onReply, 
  onEdit, 
  onDelete,
  depth = 0,
  isLoading = false 
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = comment.userId === currentUserId;
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  const handleReply = async (content) => {
    await onReply(comment.id, content);
    setShowReplyInput(false);
  };

  const handleEdit = async (content) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-surface-100 dark:bg-surface-700 px-1 py-0.5 rounded text-sm">$1</code>');
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${depth > 0 ? 'ml-8 border-l-2 border-surface-200 dark:border-surface-700 pl-4' : ''}
      `}
    >
      <div className="flex space-x-3">
        <Avatar
          name={comment.userName}
          size={depth > 0 ? 'sm' : 'md'}
          className="flex-shrink-0 mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4">
            {/* Comment Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Text as="span" className="font-medium text-surface-900 dark:text-white text-sm">
                  {comment.userName}
                </Text>
                <Text as="span" className="text-xs text-surface-500">
                  {timeAgo}
                </Text>
                {comment.isEdited && (
                  <Text as="span" className="text-xs text-surface-400">
                    (edited)
                  </Text>
                )}
              </div>
              
              {isOwner && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit comment"
                  >
                    <Icon name="Edit2" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                    title="Delete comment"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              )}
            </div>

            {/* Comment Content */}
            {isEditing ? (
              <CommentInput
                initialValue={editContent}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                placeholder="Edit your comment..."
                isReply={true}
                isLoading={isLoading}
              />
            ) : (
              <div className="group">
                <Text 
                  as="div" 
                  className="text-surface-700 dark:text-surface-300 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing && (
            <div className="flex items-center space-x-4 mt-2 ml-4">
              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs text-surface-500 hover:text-primary p-0"
                >
                  <Icon name="MessageCircle" size={14} className="mr-1" />
                  Reply
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-surface-500 hover:text-primary p-0"
                title="Like comment"
              >
                <Icon name="Heart" size={14} className="mr-1" />
                Like
              </Button>
            </div>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                onSubmit={handleReply}
                onCancel={() => setShowReplyInput(false)}
                placeholder="Write a reply..."
                isReply={true}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  depth={depth + 1}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;