'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { verificationService } from '@/services/verificationService';
import { useLanguage } from '@/context/LanguageContext';
import { BaseInput } from '@/components/common/BaseInput';
import { Shield, Upload, CheckCircle, Loader2, FileText, AlertTriangle } from 'lucide-react';

export default function VerificationPage() {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'license' | 'id' | 'certificate' | 'other'>('license');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a supporting document.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        // 1. Upload the document
        const documentUrl = await verificationService.uploadDocument(user.uid, file, documentType);
        
        // 2. Submit the application
        await verificationService.submitApplication(
          user.uid,
          licenseNumber,
          documentUrl,
          documentType
        );

        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError('User session not found. Please login again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Application Submitted!</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your verification request has been received. Our team will review your credentials and update your status within 3-5 business days.
          </p>
          <p className="text-sm text-slate-400 italic">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Apply for Verification</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Get your "Verified Expert" badge by submitting your professional credentials for review.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-8 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-bold mb-1">Why get verified?</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Appear higher in search results.</li>
              <li>Gain trust with a verification badge.</li>
              <li>Ability to post articles and courses.</li>
              <li>Enabled for live consultations.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BaseInput
            id="licenseNumber"
            name="licenseNumber"
            label="Professional License Number"
            required
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="e.g. MED-12345678"
            prefixIcon={<FileText className="h-5 w-5 text-slate-400" />}
          />

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-1">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as any)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="license">Medical License</option>
              <option value="id">Government ID / Passport</option>
              <option value="certificate">Professional Certificate</option>
              <option value="other">Other Supporting Document</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-1">
              Upload Supporting Document <span className="text-red-500">*</span>
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${file ? 'border-green-300 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10' : 'border-slate-300 dark:border-slate-700'}`}>
              <div className="space-y-1 text-center">
                <Upload className={`mx-auto h-12 w-12 ${file ? 'text-green-500' : 'text-slate-400'}`} />
                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>{file ? 'Change file' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                  {!file && <p className="pl-1">or drag and drop</p>}
                </div>
                <p className="text-xs text-slate-500">
                  {file ? file.name : 'PDF, PNG, JPG up to 5MB'}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <Upload className="w-5 h-5" />
                Submit Verification Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
