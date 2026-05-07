import React from 'react';
import { FileText, Download, MoreVertical, Calendar, Database, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Document {
  _id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  path: string;
}

interface DocumentTableProps {
  documents: Document[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (documents.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Database className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-bold text-xl mb-2">No documents yet</h3>
        <p className="text-slate-500 font-medium max-w-xs mx-auto">Your repository is currently empty. Start by uploading some PDF documents.</p>
        <button className="mt-8 px-6 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm hover:bg-primary/20 transition-all">
          Browse Templates
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Name</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Size</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Options</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {documents.map((doc, idx) => (
            <motion.tr 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={doc._id} 
              className="hover:bg-slate-50/80 transition-all duration-300 group cursor-pointer"
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate max-w-[280px]">{doc.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Application/PDF</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="text-sm text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg">{formatSize(doc.size)}</span>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(doc.uploadDate)}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <a 
                    href={`http://localhost:5000/${doc.path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
