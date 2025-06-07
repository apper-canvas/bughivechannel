import teamMembersData from '../mockData/teamMembers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TeamMemberService {
  constructor() {
    this.teamMembers = [...teamMembersData];
  }

  async getAll() {
    await delay(200);
    return [...this.teamMembers];
  }

  async getById(id) {
    await delay(150);
    const member = this.teamMembers.find(member => member.id === id);
    if (!member) {
      throw new Error('Team member not found');
    }
    return { ...member };
  }

  async create(memberData) {
    await delay(350);
    const newMember = {
      id: Date.now(),
      ...memberData
    };
    this.teamMembers.push(newMember);
    return { ...newMember };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.teamMembers.findIndex(member => member.id === id);
    if (index === -1) {
      throw new Error('Team member not found');
    }
    
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...updates
    };
    
    return { ...this.teamMembers[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.teamMembers.findIndex(member => member.id === id);
    if (index === -1) {
      throw new Error('Team member not found');
    }
    
    this.teamMembers.splice(index, 1);
    return { success: true };
  }
}

export default new TeamMemberService();