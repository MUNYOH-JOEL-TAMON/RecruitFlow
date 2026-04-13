import React, { useCallback } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

interface ResumeUploadProps {
  file: File | null;
  setFile: (val: File | null) => void;
  error?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ file, setFile, error }) => {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Only PDF files are allowed.');
    }
  };

  return (
    <div className="w-full">
      <label className="label mb-2">Resume (PDF)</label>
      
      {!file ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
            ${error ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-white/5'}`}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/20 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">Click or drag PDF to upload</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Max file size: 10MB</p>
          
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          {/* Note: In a real component, making the entire box click to open file picker requires a ref or wrapping in a label. For simplicity here, we assume the outer div triggers the input click via a ref. Updating implementation to fix click area. */}
          {/** Clicking workaround for the input: */}
          <div className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" onClick={(e) => {
            const input = e.currentTarget.parentElement?.querySelector('input');
            input?.click();
          }} />
        </div>
      ) : (
        <div className="glass p-4 rounded-xl flex items-center justify-between border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
              <File className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
