import commentsData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getByIssueId(issueId) {
    await delay(300);
    const issueComments = this.comments.filter(comment => comment.issueId === issueId);
    
    // Build threaded structure
    const commentMap = new Map();
    const rootComments = [];
    
    // First pass: create comment objects with replies array
    issueComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });
    
    // Second pass: build thread structure
    issueComments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });
    
    return rootComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async create(commentData) {
    await delay(400);
    const newComment = {
      id: Date.now(),
      ...commentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false
    };
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    
    this.comments[index] = {
      ...this.comments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
    
    return { ...this.comments[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    
    this.comments.splice(index, 1);
    return { success: true };
  }

  async reply(parentId, commentData) {
    await delay(400);
    const parentComment = this.comments.find(comment => comment.id === parentId);
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    
    const newReply = {
      id: Date.now(),
      ...commentData,
      parentId,
      issueId: parentComment.issueId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false
    };
    
    this.comments.push(newReply);
    return { ...newReply };
  }
}

export default new CommentService();