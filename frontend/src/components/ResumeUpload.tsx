import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

interface ResumeUploadProps {
  file: File | null;
  setFile: (val: File | null) => void;
  error?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ file, setFile, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Only PDF files are allowed.');
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const openFilePicker = () => inputRef.current?.click();

  return (
    <div className="w-full">
      <label className="label mb-2">Resume (PDF) *</label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
            // Reset so the same file can be re-selected
            e.target.value = '';
          }
        }}
      />

      {!file ? (
        /* ── Drop zone ─────────────────────────────────────────── */
        <div
          onClick={openFilePicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openFilePicker()}
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
            ${isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 scale-[1.01]'
              : error
              ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-slate-50 dark:bg-black/20 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors
            ${isDragging
              ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/20 group-hover:text-brand-600 dark:group-hover:text-brand-400'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-1">
            {isDragging ? 'Drop your PDF here' : 'Click or drag PDF to upload'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">PDF only · Max 10 MB</p>
        </div>
      ) : (
        /* ── File preview ──────────────────────────────────────── */
        <div className="glass p-4 rounded-xl flex items-center justify-between border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center flex-shrink-0">
              <File className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              type="button"
              onClick={openFilePicker}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ResumeUpload;

