import React from 'react';

export const ProfileBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.07] blur-[140px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/[0.07] blur-[140px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-[0.02] dark:opacity-[0.03]" />
    </div>
  );
};
