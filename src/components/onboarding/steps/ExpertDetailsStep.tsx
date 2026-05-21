'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Sparkles, Languages, Shield, Banknote, Leaf, Package, Video, Plus, X, Check } from 'lucide-react';
import { FormFieldWrapper } from '../FormFieldWrapper';
import { BaseInput } from '../../common/BaseInput';

interface ExpertDetailsStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function ExpertDetailsStep({ formData, setFormData }: ExpertDetailsStepProps) {
  const isDoctor = formData.role === 'doctor';
  const [inputValue, setInputValue] = useState('');
  const [activeField, setActiveField] = useState<string>('specialties');

  const addTag = (field: string, value: string) => {
    if (!value) return;
    const currentTags = [...(formData[field] || [])];
    if (!currentTags.includes(value)) {
      currentTags.push(value);
      setFormData({ ...formData, [field]: currentTags });
    }
    setInputValue('');
  };

  const removeTag = (field: string, value: string) => {
    const currentTags = formData[field]?.filter((item: string) => item !== value) || [];
    setFormData({ ...formData, [field]: currentTags });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-10"
    >
      <div className="space-y-2">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          {isDoctor ? 'Clinical Profile.' : 'Practitioner Profile.'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {isDoctor ? 'Define your medical specialties and operational parameters.' : 'List your healing modalities and specialized wellness services.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Specialties or Modalities */}
        <div className="md:col-span-2 space-y-4">
          <FormFieldWrapper 
            label={isDoctor ? "Medical Specialties" : "Healing Modalities"} 
            icon={isDoctor ? <Stethoscope size={14} /> : <Leaf size={14} />} 
            isRequired
          >
            <div className="flex gap-3">
              <BaseInput
                id="specialties-modalities-input"
                value={activeField === (isDoctor ? 'specialties' : 'modalities') ? inputValue : ''}
                onChange={(e) => {
                  setActiveField(isDoctor ? 'specialties' : 'modalities');
                  setInputValue(e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && addTag(isDoctor ? 'specialties' : 'modalities', inputValue)}
                placeholder={isDoctor ? "e.g. Cardiology, Pediatrics" : "e.g. Acupuncture, Ayurveda"}
                className="flex-1 !rounded-[20px]"
              />
              <button
                onClick={() => addTag(isDoctor ? 'specialties' : 'modalities', inputValue)}
                className="px-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <AnimatePresence>
                {(isDoctor ? formData.specialties : formData.modalities)?.map((tag: string) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-widest"
                  >
                    {tag}
                    <button onClick={() => removeTag(isDoctor ? 'specialties' : 'modalities', tag)} className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-md">
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </FormFieldWrapper>
        </div>

        {/* Consultation Fee */}
        <FormFieldWrapper label="Standard Consultation Fee" icon={<Banknote size={14} />} isRequired>
          <BaseInput
            id="consultation-fee"
            value={formData.consultationFee}
            onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
            placeholder="e.g. $50 or Local Currency"
            className="!rounded-[20px]"
          />
        </FormFieldWrapper>

        {/* Languages or Inventory */}
        <div className="space-y-4">
          <FormFieldWrapper 
            label={isDoctor ? "Languages Spoken" : "Herbal Inventory Types"} 
            icon={isDoctor ? <Languages size={14} /> : <Package size={14} />}
          >
            <div className="flex gap-3">
              <BaseInput
                id="languages-inventory-input"
                value={activeField === (isDoctor ? 'languages' : 'inventory') ? inputValue : ''}
                onChange={(e) => {
                  setActiveField(isDoctor ? 'languages' : 'inventory');
                  setInputValue(e.target.value);
                }}
                onKeyPress={(e) => e.key === 'Enter' && addTag(isDoctor ? 'languages' : 'inventory', inputValue)}
                placeholder={isDoctor ? "e.g. English, Swahili" : "e.g. Tinctures, Dried Herbs"}
                className="flex-1 !rounded-[20px]"
              />
              <button
                type="button"
                onClick={() => addTag(isDoctor ? 'languages' : 'inventory', inputValue)}
                className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {(isDoctor ? formData.languages : formData.inventory)?.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {tag}
                  <button type="button" onClick={() => removeTag(isDoctor ? 'languages' : 'inventory', tag)}><X size={10} /></button>
                </span>
              ))}
            </div>
          </FormFieldWrapper>
        </div>

        {!isDoctor && (
          <div className="space-y-4">
            <FormFieldWrapper label="Primary Herbal Products" icon={<Leaf size={14} />}>
              <div className="flex gap-3">
                <BaseInput
                  id="herbal-products-input"
                  value={activeField === 'herbalProducts' ? inputValue : ''}
                  onChange={(e) => {
                    setActiveField('herbalProducts');
                    setInputValue(e.target.value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addTag('herbalProducts', inputValue)}
                  placeholder="e.g. Ginseng Root, Elderberry Syrup"
                  className="flex-1 !rounded-[20px]"
                />
                <button
                  type="button"
                  onClick={() => addTag('herbalProducts', inputValue)}
                  className="px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.herbalProducts?.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                    {tag}
                    <button type="button" onClick={() => removeTag('herbalProducts', tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </FormFieldWrapper>
          </div>
        )}

        {/* Insurances or Workshop */}
        {isDoctor ? (
          <div className="md:col-span-2 space-y-4">
            <FormFieldWrapper label="Accepted Insurance Providers" icon={<Shield size={14} />}>
              <div className="flex gap-3">
                <BaseInput
                  id="insurances-input"
                  value={activeField === 'insurances' ? inputValue : ''}
                  onChange={(e) => {
                    setActiveField('insurances');
                    setInputValue(e.target.value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addTag('insurances', inputValue)}
                  placeholder="e.g. Aetna, Blue Cross"
                  className="flex-1 !rounded-[20px]"
                />
                <button
                  onClick={() => addTag('insurances', inputValue)}
                  className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.insurances?.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {tag}
                    <button onClick={() => removeTag('insurances', tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </FormFieldWrapper>
          </div>
        ) : (
          <div className="md:col-span-2 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Video size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Virtual Workshop Capabilities</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Are you able to host online sessions?</p>
              </div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, workshopCapabilities: !formData.workshopCapabilities })}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.workshopCapabilities ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.workshopCapabilities ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        )}
      </div>

      <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[40px] text-white flex gap-6 relative overflow-hidden">
        <Sparkles className="w-8 h-8 text-blue-400 shrink-0 mt-1 relative z-10" />
        <div className="relative z-10">
          <p className="text-xs font-medium leading-relaxed opacity-80">
            {isDoctor 
              ? "Your clinical profile will be used to intelligently match patients based on their specific needs and your verified expertise."
              : "Herbal and traditional practitioners are required to maintain accurate inventory descriptions to ensure patient safety and compliance."}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </motion.div>
  );
}
