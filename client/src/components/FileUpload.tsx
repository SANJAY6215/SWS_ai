import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import socket from '../services/socket';
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
      toast.info(`Upload in progress — processing ${fileObjects.length} files in background.`);
    }

    // Simulate upload for each file (since we're using a simple multer setup)
    for (const fileObj of fileObjects) {
      await uploadFile(fileObj);
    }

    if (fileObjects.length > 3) {
      // Background process simulated notification will come from backend via socket
    } else {
      onUploadComplete();
    }
  };

  const uploadFile = async (fileObj: UploadingFile) => {
    const formData = new FormData();
    formData.append('files', fileObj.file);

    setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

    try {
      // Mocking progress for better UX as Multer doesn't give intermediate progress easily without more complex setup
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress } : f));
        }
      }, 200);

      await api.post('/documents/upload', formData);
      
      clearInterval(interval);
      setUploadingFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: 100, status: 'complete' } : f));
      
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
        if (uploadingFiles.length <= 1) setIsBulkProcessing(false);
      }, 2000);

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
    <div className="space-y-6">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center gap-4 ${
          isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-200 bg-white hover:border-primary/50'
        }`}
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">Click or drag files to upload</h3>
          <p className="text-sm text-slate-500 mt-1">Only PDF files are supported. Max file size 10MB.</p>
        </div>
        <input 
          type="file" 
          multiple 
          accept=".pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <button className="mt-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          Select Files
        </button>
      </div>

      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white border rounded-2xl p-6 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                Uploading {uploadingFiles.length} files 
                {isBulkProcessing && <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Background Processing</span>}
              </h4>
            </div>
            
            <div className={`space-y-4 ${isBulkProcessing ? 'max-h-40 overflow-y-auto pr-2' : ''}`}>
              {uploadingFiles.map((file) => (
                <div key={file.id} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.file.name}</p>
                        <p className="text-xs text-slate-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">{file.progress}%</span>
                      {file.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : file.status === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      className={`h-full transition-all ${
                        file.status === 'failed' ? 'bg-red-500' : 'bg-primary'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default FileUpload;
