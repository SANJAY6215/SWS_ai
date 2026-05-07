import React, { useState, useEffect } from 'react';
import DocumentTable from '../components/DocumentTable';
import api from '../services/api';
import { Files, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredDocs = documents.filter((doc: any) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
            <Files className="w-4 h-4" />
            Asset Management
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Documents</h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Access and manage your complete document repository.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center glass-card rounded-[2rem]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synchronizing Library...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2rem] overflow-hidden border-slate-100 premium-shadow"
        >
          <DocumentTable documents={filteredDocs} />
        </motion.div>
      )}
    </div>
  );
};

export default Documents;
