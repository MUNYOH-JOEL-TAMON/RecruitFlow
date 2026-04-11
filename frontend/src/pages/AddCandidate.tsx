import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { candidatesApi } from '../lib/api';
import { AddCandidateForm } from '../types';
import ResumeUpload from '../components/ResumeUpload';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AddCandidateForm>();

  const onSubmit = async (data: AddCandidateForm) => {
    if (!file) {
      toast.error('Please upload a resume (PDF)');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.position) formData.append('position', data.position);
      if (data.jobDescription) formData.append('jobDescription', data.jobDescription);
      if (data.notes) formData.append('notes', data.notes);
      formData.append('resume', file);

      await candidatesApi.create(formData);
      toast.success('Candidate added! AI screening initiated.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto pb-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-brand-400" />
          Add New Candidate
        </h1>
        <p className="text-slate-400 text-sm mt-1">Upload a resume and the Smart Screener will automatically parse skills and experience.</p>
      </div>

      <div className="glass p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name *</label>
              <input 
                {...register('name', { required: 'Name is required' })} 
                className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} 
                placeholder="Jane Doe" 
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="label">Email *</label>
              <input 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                })} 
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} 
                placeholder="jane@example.com" 
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input {...register('phone')} className="input" placeholder="+1 (555) 000-0000" />
            </div>

            <div>
              <label className="label">Target Position</label>
              <input {...register('position')} className="input" placeholder="Frontend Developer" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="label">Target Job Description (for AI Matching)</label>
            <p className="text-xs text-slate-500 mb-2">Paste the job description here. The Smart Screener will score the resume against this.</p>
            <textarea 
              {...register('jobDescription')} 
              className="input min-h-[120px] resize-y"
              placeholder="We are looking for a developer with React, Node.js..."
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <ResumeUpload file={file} setFile={setFile} />
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="label">Recruiter Notes</label>
            <textarea {...register('notes')} className="input min-h-[80px]" placeholder="Any initial context..." />
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-40">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
