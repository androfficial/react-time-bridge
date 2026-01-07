/**
 * Dialog component for adding a new timezone
 */

import { useState } from 'react';

import { Plus } from 'lucide-react';

import { TimezoneSelect } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type AddTimezoneDialogProps = {
  disabled?: boolean;
  onAdd: (timezoneId: string) => void;
};

export const AddTimezoneDialog = ({
  onAdd,
  disabled,
}: AddTimezoneDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('');

  const handleAdd = () => {
    if (selectedTimezone) {
      onAdd(selectedTimezone);
      setSelectedTimezone('');
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedTimezone('');
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-1.5 text-xs"
          disabled={disabled}
          size="sm"
          variant="outline"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Timezone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Timezone</DialogTitle>
          <DialogDescription>
            Select a timezone to add to the converter.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <TimezoneSelect
            onValueChange={setSelectedTimezone}
            placeholder="Select timezone to add"
            value={selectedTimezone}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={!selectedTimezone} onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
