import React from 'react';
import { Check } from 'lucide-react';

type GenderToggleProps = {
  gender: 'male' | 'female' | undefined;
  onChange: (gender: 'male' | 'female') => void;
  className?: string;
};

export function GenderToggle({ gender, onChange, className = '' }: GenderToggleProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <button 
        type="button"
        className={`px-3 py-1.5 rounded-full text-sm flex items-center justify-center ${
          gender === 'male' 
            ? 'bg-blue-500 text-white' 
            : 'bg-[var(--color-background-post)] border border-blue-500 text-blue-500'
        }`}
        onClick={() => onChange('male')}
        aria-pressed={gender === 'male'}
      >
        Male {gender === 'male' && <Check className="inline-block ml-1 h-3 w-3" />}
      </button>
      <button 
        type="button"
        className={`px-3 py-1.5 rounded-full text-sm flex items-center justify-center ${
          gender === 'female' 
            ? 'bg-pink-500 text-white' 
            : 'bg-[var(--color-background-post)] border border-pink-500 text-pink-500'
        }`}
        onClick={() => onChange('female')}
        aria-pressed={gender === 'female'}
      >
        Female {gender === 'female' && <Check className="inline-block ml-1 h-3 w-3" />}
      </button>
    </div>
  );
}