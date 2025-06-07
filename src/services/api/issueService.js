import issuesData from '../mockData/issues.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class IssueService {
  constructor() {
    this.issues = [...issuesData];
  }

  async getAll() {
    await delay(300);
    return [...this.issues];
  }

  async getById(id) {
    await delay(200);
    const issue = this.issues.find(issue => issue.id === id);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return { ...issue };
  }

  async create(issueData) {
    await delay(400);
    const newIssue = {
      id: Date.now(),
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.issues.push(newIssue);
    return { ...newIssue };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.issues.findIndex(issue => issue.id === id);
    if (index === -1) {
      throw new Error('Issue not found');
    }
    
    this.issues[index] = {
      ...this.issues[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.issues[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.issues.findIndex(issue => issue.id === id);
    if (index === -1) {
      throw new Error('Issue not found');
    }
    
    this.issues.splice(index, 1);
    return { success: true };
  }
}

export default new IssueService();