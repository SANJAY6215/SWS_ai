import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const History: React.FC = () => {
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

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-widest">
          <Clock className="w-4 h-4" />
          Processing Timeline
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Activity History</h1>
        <p className="text-slate-500 font-medium max-w-xl">
          Monitor the processing status and audit logs of your assets.
        </p>
      </header>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center glass-card rounded-[2rem]">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Activity...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-20 text-center glass-card rounded-[2rem]">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No activity logged</h3>
          <p className="text-slate-500 mt-2">Start uploading documents to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc: any, idx: number) => (
            <motion.div 
              key={doc._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 rounded-3xl flex items-center justify-between group hover:bg-white transition-all border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  doc.status === 'complete' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-500'
                }`}>
                  {doc.status === 'complete' ? <CheckCircle2 className="w-6 h-6" /> : <Loader2 className="w-6 h-6 animate-spin" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-slate-900">{doc.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    Uploaded on {new Date(doc.uploadDate).toLocaleString()} • {(doc.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-900">System processed</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified by SWS AI</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-all cursor-pointer">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
