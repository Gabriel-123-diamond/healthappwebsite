import React from 'react';
import { motion } from 'framer-motion';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  href?: string;
}

export function ContactCard({ icon, title, desc, color, href }: ContactCardProps) {
  const Card = (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 text-center shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all cursor-pointer group h-full"
    >
      <div className={`w-16 h-16 rounded-[28px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );

  if (href) {
    return <a href={href}>{Card}</a>;
  }

  return Card;
}
