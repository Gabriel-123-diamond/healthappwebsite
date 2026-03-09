import React from 'react';
import { User, MapPin } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import CustomDatePicker from '@/components/common/CustomDatePicker';

interface PersonalInfoFieldsProps {
  userProfile: any;
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export function PersonalInfoFields({
  userProfile,
  formData,
  handleUpdate,
  validationErrors,
}: PersonalInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 px-1">
        <User size={14} /> Personal Information
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="firstName"
          label="First Name"
          required
          value={userProfile?.firstName || ''}
          disabled={true}
          placeholder="First Name"
          prefixIcon={<User className="w-4 h-4 text-slate-400" />}
          className="!rounded-2xl bg-slate-50"
        />
        <BaseInput
          id="lastName"
          label="Last Name"
          required
          value={userProfile?.lastName || ''}
          disabled={true}
          placeholder="Last Name"
          prefixIcon={<User className="w-4 h-4 text-slate-400" />}
          className="!rounded-2xl bg-slate-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomDatePicker
          label="Date of Birth"
          required
          value={formData.kyc?.dob || ''}
          onChange={(val) => handleUpdate('kyc', { ...formData.kyc, dob: val })}
          error={validationErrors.dob}
        />
        <BaseInput
          id="address"
          label="Residential Address"
          required
          value={formData.kyc?.address || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdate('kyc', { ...formData.kyc, address: e.target.value })}
          placeholder="Full residential address"
          prefixIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          error={validationErrors.address}
          className="!rounded-2xl"
        />
      </div>
    </div>
  );
}
