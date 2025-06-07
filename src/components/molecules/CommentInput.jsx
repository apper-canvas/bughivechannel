import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Icon from '@/components/atoms/Icon';

const CommentInput = ({ 
  onSubmit, 
  placeholder = "Write a comment...", 
  maxLength = 500,
  isReply = false,
  onCancel,
  initialValue = '',
  isLoading = false,
  className = ''
}) => {
  const [content, setContent] = useState(initialValue);
  const [isFormatted, setIsFormatted] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.length > maxLength) return;
    
    await onSubmit(content.trim());
    setContent('');
  };

  const insertFormatting = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after the formatted text
    setTimeout(() => {
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-surface-200 dark:border-surface-700 rounded-lg p-4 bg-white dark:bg-surface-800 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Formatting Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bold')}
              className="p-1"
              title="Bold (Ctrl+B)"
            >
              <Icon name="Bold" size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('italic')}
              className="p-1"
              title="Italic (Ctrl+I)"
            >
              <Icon name="Italic" size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('code')}
              className="p-1"
              title="Code"
            >
              <Icon name="Code" size={16} />
            </Button>
          </div>
          
          <Text 
            as="span" 
            className={`text-xs ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-surface-400'}`}
          >
            {remainingChars}
          </Text>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full min-h-[100px] p-3 border border-surface-200 dark:border-surface-600 rounded-md
            bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-white
            placeholder-surface-400 dark:placeholder-surface-500
            focus:ring-2 focus:ring-primary focus:border-primary
            resize-none transition-colors
            ${isOverLimit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          rows={isReply ? 3 : 4}
          maxLength={maxLength + 50} // Allow typing over limit to show error
          aria-label={placeholder}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {content.length > 0 && (
              <Text as="span" className="text-xs text-surface-500">
                Preview formatting with **bold** and *italic*
              </Text>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isReply && onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!content.trim() || isOverLimit || isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                isReply ? 'Reply' : 'Comment'
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CommentInput;