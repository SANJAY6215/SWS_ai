import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import DocumentTable from '../components/DocumentTable';
import api from '../services/api';
import { Files, Info } from 'lucide-react';

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

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Management</h1>
        <p className="text-slate-500">Upload, track, and manage your company policy documents in real-time.</p>
      </div>

      <section>
        <FileUpload onUploadComplete={fetchDocuments} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Files className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-800">Recent Documents</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Info className="w-4 h-4" />
            Showing latest {documents.length} uploads
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <DocumentTable documents={documents} />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
