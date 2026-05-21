'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, AlertCircle, Plus } from 'lucide-react';

export function DigitalDispensaryWidget() {
  const inventory = [
    { name: 'Ashwagandha Extract', stock: 12, status: 'ok' },
    { name: 'Holy Basil Tincture', stock: 2, status: 'low' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <ShoppingBag size={14} className="text-emerald-600" /> Digital Dispensary
        </h3>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Plus size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {inventory.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                <Package size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">In Stock: {item.stock}</p>
              </div>
            </div>
            {item.status === 'low' && (
              <AlertCircle size={14} className="text-amber-500" />
            )}
          </div>
        ))}
      </div>

      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
        Manage Inventory
      </button>
    </div>
  );
}
