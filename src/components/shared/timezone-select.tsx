/**
 * Timezone selector component with grouped options
 */

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { findTimezoneById, getTimezoneGroups } from '@/constants';

type TimezoneSelectProps = {
  disabled?: boolean;
  onValueChange: (timezoneId: string) => void;
  placeholder?: string;
  value: string;
};

export const TimezoneSelect = ({
  value,
  onValueChange,
  placeholder = 'Select timezone',
  disabled = false,
}: TimezoneSelectProps) => {
  const groups = getTimezoneGroups();
  const selectedTimezone = findTimezoneById(value);

  return (
    <Select disabled={disabled} onValueChange={onValueChange} value={value}>
      <SelectTrigger className="h-10 w-full rounded-lg">
        <SelectValue placeholder={placeholder}>
          {selectedTimezone && (
            <span className="flex items-center gap-2">
              <span>{selectedTimezone.name}</span>
              <span className="text-muted-foreground text-xs">
                ({selectedTimezone.abbreviation})
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {groups.map((group) => (
          <SelectGroup key={group.region}>
            <SelectLabel className="text-muted-foreground text-xs font-semibold">
              {group.region}
            </SelectLabel>
            {group.timezones.map((tz) => (
              <SelectItem key={tz.id} value={tz.id}>
                <span className="flex items-center gap-2">
                  <span>{tz.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {tz.abbreviation}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
