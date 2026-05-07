import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentTable from '../components/DocumentTable';
import api from '../services/api';
import { Files, Info, ShieldCheck, Zap, BarChart3, Clock, CloudUpload } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const stats = [
    { label: 'Total Documents', value: documents.length, icon: Files, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'System Health', value: 'Optimal', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Storage Used', value: '1.2 GB', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Last Activity', value: '2m ago', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest"
          >
            <Zap className="w-4 h-4 fill-primary" />
            Active Workspace
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Document Hub</h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Streamline your organizational workflow with AI-powered document management and real-time processing.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-3xl hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Files className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Recent Uploads</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200/50">
                <Info className="w-4 h-4" />
                {documents.length} Files Total
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center glass-card rounded-3xl">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching Assets...</p>
              </div>
            ) : (
              <div className="glass-card rounded-3xl overflow-hidden border-slate-100">
                <DocumentTable documents={documents} />
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <CloudUpload className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Quick Upload</h2>
            </div>
            <FileUpload onUploadComplete={fetchDocuments} />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
