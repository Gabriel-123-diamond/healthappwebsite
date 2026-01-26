'use client';

import { Link } from '@/i18n/routing';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
               <span className="text-6xl font-bold text-blue-600">404</span>
            </div>
            <div className="absolute -right-4 -bottom-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100">
               <Search className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            Oops! It seems like the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col gap-3">
             <Link 
              href="/"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
