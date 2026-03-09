import { useState } from 'react';
import { PhoneEntry } from '../components/expert/ExpertPhoneManager';
import { countries } from '@/data/countries';
import { userService } from '@/services/userService';

export function usePhoneManager(phones: PhoneEntry[], onChange: (phones: PhoneEntry[]) => void) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPhone, setNewPhone] = useState<PhoneEntry>({ number: '', code: '+234', label: 'Office' });
  const [verificationStep, setVerificationStep] = useState<'idle' | 'otp'>('idle');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const getCountryByCode = (code: string) => {
    return countries.find(c => c.code === code) || countries.find(c => c.code === '+1');
  };

  const activeCountry = getCountryByCode(newPhone.code);
  const minLen = activeCountry?.min || 7;
  const maxLen = activeCountry?.max || 15;
  const isLengthValid = newPhone.number.replace(/\s/g, '').length >= minLen;

  const handleStartAdd = () => {
    setIsAdding(true);
    setVerificationStep('idle');
    setNewPhone({ number: '', code: '+234', label: 'Office' });
    setError('');
  };

  const handleSendOtp = async () => {
    const rawNumber = newPhone.number.replace(/\s/g, '');
    if (!rawNumber) {
      setError('Please enter a phone number');
      return;
    }

    if (rawNumber.length < minLen) {
      setError(`Phone number too short for ${activeCountry?.name || 'this country'}. Min ${minLen} digits.`);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const fullNumber = `${newPhone.code}${rawNumber}`;
      
      const isTaken = await userService.isPhoneTaken(fullNumber);
      if (isTaken) {
        setError('number in use already');
        setIsVerifying(false);
        return;
      }

      if (phones.some(p => p.code === newPhone.code && p.number.replace(/\s/g, '') === rawNumber)) {
        setError('number in use already');
        setIsVerifying(false);
        return;
      }

      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStep('otp');
      }, 1500);
    } catch (e) {
      console.error(e);
      setError('Connection error. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === '123456') {
      setIsVerifying(true);
      setTimeout(() => {
        onChange([...phones, { ...newPhone, isVerified: true }]);
        setIsAdding(false);
        setIsVerifying(false);
        setOtp('');
      }, 1000);
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const removePhone = (index: number) => {
    if (phones.length <= 1) {
      setError('You must have at least one verified phone number.');
      return;
    }
    onChange(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, updates: Partial<PhoneEntry>) => {
    const newPhones = [...phones];
    newPhones[index] = { ...newPhones[index], ...updates };
    onChange(newPhones);
  };

  return {
    isAdding,
    setIsAdding,
    newPhone,
    setNewPhone,
    verificationStep,
    setVerificationStep,
    otp,
    setOtp,
    isVerifying,
    error,
    setError,
    maxLen,
    isLengthValid,
    handleStartAdd,
    handleSendOtp,
    handleVerifyOtp,
    removePhone,
    updatePhone,
  };
}
