import React from 'react';

export default function ExpertServicesList() {
  const services = ['Consultation', 'Diagnostic Imaging', 'Preventive Care', 'Follow-up Treatment'];
  
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Services</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            {service}
          </li>
        ))}
      </ul>
    </section>
  );
}
