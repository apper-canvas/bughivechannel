import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(250);
    return [...this.activities];
  }

  async getByIssueId(issueId) {
    await delay(200);
    return this.activities.filter(activity => activity.issueId === issueId);
  }

  async create(activityData) {
    await delay(300);
    const newActivity = {
      id: Date.now(),
      ...activityData,
      timestamp: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async delete(id) {
    await delay(200);
    const index = this.activities.findIndex(activity => activity.id === id);
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    this.activities.splice(index, 1);
    return { success: true };
  }
}

export default new ActivityService();