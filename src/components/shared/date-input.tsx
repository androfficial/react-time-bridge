/**
 * Date input component for selecting dates
 */

import { Calendar } from 'lucide-react';

import { cn } from '@/lib/utils';

type DateInputProps = {
  disabled?: boolean;
  label?: string;
  onChange: (value: string) => void;
  value: string;
};

export const DateInput = ({
  value,
  onChange,
  label,
  disabled = false,
}: DateInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <Calendar className="text-muted-foreground/50 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:ring-ring flex h-10 w-full rounded-lg border pr-3 pl-10 text-sm font-medium',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          value={value}
        />
      </div>
    </div>
  );
};
