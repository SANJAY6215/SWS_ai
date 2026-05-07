import React, { useCallback, useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FileUploadProps {
  onUploadComplete: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'failed';
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (newFiles.length === 0) {
      toast.error('Please upload PDF files only');
      return;
    }

    const fileObjects: UploadingFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploadingFiles(prev => [...prev, ...fileObjects]);
    
    if (fileObjects.length > 3) {
      setIsBulkProcessing(true);
      toast.info(`Bulk processing initiated for ${fileObjects.length} files`);
    }

    for (const fileObj of fileObjects) {
      await uploadFile(fileObj);
    }

    if (fileObjects.length <= 3) {
      onUploadComplete();
    }
  };

  const uploadFile = async (fileObj: UploadingFile) => {
    const formData = new FormData();
    formData.append('files', fileObj.file);

    setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

    try {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress } : f));
        }
      }, 150);

      await api.post('/documents/upload', formData);
      
      clearInterval(interval);
      setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: 100, status: 'complete' } : f));
      
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
        if (uploadingFiles.length <= 1) setIsBulkProcessing(false);
      }, 3000);

    } catch (err) {
      setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'failed' } : f));
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  return (
    <div className="space-y-8">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-[2rem] p-16 transition-all duration-500 flex flex-col items-center justify-center gap-6 overflow-hidden group ${
          isDragging 
            ? 'border-primary bg-primary/[0.03] scale-[1.02] shadow-2xl shadow-primary/10' 
            : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50/50'
        }`}
      >
        {/* Animated background elements */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />

        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500 transform ${
          isDragging ? 'bg-primary text-white scale-110 rotate-12 shadow-xl shadow-primary/30' : 'bg-slate-100 text-slate-400 group-hover:scale-110 group-hover:text-primary group-hover:bg-primary/10'
        }`}>
          <CloudUpload className="w-10 h-10" />
        </div>
        
        <div className="text-center relative z-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Drop your PDFs here</h3>
          <p className="text-slate-500 font-medium">Or click to browse from your computer</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full">Max 10MB</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full">PDF Only</span>
          </div>
        </div>

        <input 
          type="file" 
          multiple 
          accept=".pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        <button className="relative z-10 mt-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5">
          Select Files
        </button>
      </div>

      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-[2rem] p-8 premium-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  Upload Queue
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {uploadingFiles.length} Active
                  </span>
                </h4>
                {isBulkProcessing && <p className="text-sm text-slate-500 mt-1">Processing in background... You can continue working.</p>}
              </div>
            </div>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {uploadingFiles.map((file) => (
                <motion.div 
                  layout
                  key={file.id} 
                  className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[250px]">{file.file.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-900">{file.progress}%</span>
                      {file.status === 'complete' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : file.status === 'failed' ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      className={`h-full transition-all duration-500 ${
                        file.status === 'failed' ? 'bg-red-500' : 'bg-gradient-to-r from-primary to-blue-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default FileUpload;
