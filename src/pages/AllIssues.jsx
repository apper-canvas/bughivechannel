import IssueTracker from '../components/organisms/IssueTracker';

const AllIssues = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Issues</h1>
        <p className="text-gray-600 mt-1">Manage and track all reported issues</p>
      </div>
      <IssueTracker />
    </div>
  );
};

export default AllIssues;