import AllIssues from '../pages/AllIssues';
import MyIssues from '../pages/MyIssues';
import CreateIssue from '../pages/CreateIssue';
import Reports from '../pages/Reports';

export const routes = {
  'all-issues': {
    id: 'all-issues',
    label: 'All Issues',
    icon: 'Bug',
    component: AllIssues,
    path: '/all-issues'
  },
  'my-issues': {
    id: 'my-issues',
    label: 'My Issues',
    icon: 'User',
    component: MyIssues,
    path: '/my-issues'
  },
  'create-issue': {
    id: 'create-issue',
    label: 'Create New',
    icon: 'Plus',
    component: CreateIssue,
    path: '/create-issue'
  },
  'reports': {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart3',
    component: Reports,
    path: '/reports'
  }
};

export const routeArray = Object.values(routes);