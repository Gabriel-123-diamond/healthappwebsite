import React from 'react';

interface SandboxDebugControlsProps {
  emailStatus: string;
  emailVerified: boolean;
  onReset: () => void;
}

export const SandboxDebugControls: React.FC<SandboxDebugControlsProps> = ({
  emailStatus,
  emailVerified,
  onReset,
}) => {
  return (
    <>
      {emailStatus === 'sent' && !emailVerified && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-dashed border-blue-200 dark:border-blue-800 flex flex-col items-center text-center gap-2">
          <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Sandbox Mode</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Use code{' '}
            <span className="text-blue-600 dark:text-blue-400 font-black px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-800 mx-1">
              123456
            </span>{' '}
            to simulate verification for this demo.
          </p>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="flex justify-center pt-10">
          <button
            onClick={onReset}
            className="text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors"
          >
            Reset Verification (Debug Only)
          </button>
        </div>
      )}
    </>
  );
};
