import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import { Files, Clock } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Documents':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] glass-card rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
              <Files className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Documents Repository</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Your centralized storage for all processed assets. Access, manage, and track your document history here.
            </p>
            <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
              Coming Soon
            </button>
          </div>
        );
      case 'History':
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] glass-card rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Activity History</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Track the lifecycle of every document. Monitor processing status, timestamps, and system logs.
            </p>
            <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
              Coming Soon
            </button>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
