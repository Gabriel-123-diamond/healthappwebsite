import React from 'react';
import { Shield, Upload, CheckCircle, Loader2, FileText, Phone } from 'lucide-react';
import { VerificationCard } from '@/components/onboarding/VerificationCard';
import { SandboxProtocol } from '@/components/onboarding/SandboxProtocol';
import { BaseInput } from '@/components/common/BaseInput';

export const VerificationSuccessState = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4 pt-32 sm:pt-40">
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

export const VerificationHeader = () => (
  <div className="text-center mb-10">
    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
      <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
    </div>
    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Professional Verification</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
      Complete your clinical verification to unlock expert network features.
    </p>
  </div>
);

export const PhoneVerificationSection = ({
  userData, phoneStatus, phoneOtp, setPhoneOtp, onSend, onVerify, onReset, t
}: {
  userData: any, phoneStatus: any, phoneOtp: string, setPhoneOtp: (v: string) => void, onSend: () => void, onVerify: () => void, onReset: () => void, t: any
}) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-1">Step 1: Network Security</h3>
    <VerificationCard
      id="phone-verify"
      label="Contact Information"
      value={userData?.phone || 'Loading...'}
      icon={<Phone className="w-6 h-6" />}
      status={phoneStatus}
      otpValue={phoneOtp}
      setOtpValue={setPhoneOtp}
      onSend={onSend}
      onVerify={onVerify}
      onReset={onReset}
      isResumed={userData?.phoneVerified || false}
      actionLabel="Verify Phone"
      t={t}
    />
    {phoneStatus === 'sent' && <SandboxProtocol />}
  </div>
);

export const DocumentUploadSection = ({
  licenseNumber, setLicenseNumber,
  documentType, setDocumentType,
  file, handleFileChange,
  handleSubmit, loading, error, phoneStatus
}: {
  licenseNumber: string, setLicenseNumber: (v: string) => void,
  documentType: string, setDocumentType: (v: any) => void,
  file: File | null, handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (e: React.FormEvent) => void,
  loading: boolean, error: string, phoneStatus: string
}) => (
  <div className="space-y-6">
    <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-1">Step 2: Clinical Credentials</h3>
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
          className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none font-bold"
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
        <div className={`mt-1 flex justify-center px-6 pt-8 pb-10 border-2 border-dashed rounded-[24px] transition-colors ${file ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-900'}`}>
          <div className="space-y-2 text-center">
            <Upload className={`mx-auto h-12 w-12 ${file ? 'text-emerald-500' : 'text-slate-300'}`} />
            <div className="flex text-sm text-slate-600 dark:text-slate-400">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-blue-600 hover:text-blue-500">
                <span>{file ? 'Change file' : 'Click to upload'}</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              </label>
              {!file && <p className="pl-1">or drag and drop</p>}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {file ? file.name : 'PDF, PNG, JPG (Max 5MB)'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || phoneStatus !== 'verified'}
        className="w-full py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:bg-blue-600 dark:hover:bg-blue-50 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            <Upload size={16} />
            Submit Verification Protocol
          </>
        )}
      </button>
    </form>
  </div>
);
