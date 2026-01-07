/**
 * Main navigation tabs component
 */

import { useState } from 'react';

import { Clock, Users } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingPlanner, TimeConverter } from '@/features';

const TAB_STORAGE_KEY = 'time-bridge-active-tab';
const VALID_TABS = ['converter', 'planner'] as const;
type TabValue = (typeof VALID_TABS)[number];

const getInitialTab = (): TabValue => {
  try {
    const stored = localStorage.getItem(TAB_STORAGE_KEY);
    if (stored && VALID_TABS.includes(stored as TabValue)) {
      return stored as TabValue;
    }
  } catch {
    // localStorage not available
  }
  return 'converter';
};

export const MainTabs = () => {
  const [activeTab, setActiveTab] = useState<TabValue>(getInitialTab);

  const handleTabChange = (value: string) => {
    const tab = value as TabValue;
    setActiveTab(tab);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch {
      // localStorage not available
    }
  };

  return (
    <Tabs
      className="flex min-h-0 flex-1 flex-col gap-5"
      onValueChange={handleTabChange}
      value={activeTab}
    >
      <TabsList className="bg-card/80 border-border/50 shadow-primary/5 mx-auto grid h-12 w-full max-w-sm shrink-0 grid-cols-2 gap-1 rounded-2xl border p-1.5 shadow-sm backdrop-blur-xl">
        <TabsTrigger
          className="data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:shadow-primary/25 gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-linear-to-r data-[state=active]:text-white data-[state=active]:shadow-md"
          value="converter"
        >
          <Clock aria-hidden="true" className="h-4 w-4" />
          <span className="hidden text-sm font-semibold sm:inline">
            Time Converter
          </span>
          <span className="text-sm font-semibold sm:hidden">Convert</span>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:shadow-primary/25 gap-2 rounded-xl transition-all duration-300 data-[state=active]:bg-linear-to-r data-[state=active]:text-white data-[state=active]:shadow-md"
          value="planner"
        >
          <Users aria-hidden="true" className="h-4 w-4" />
          <span className="hidden text-sm font-semibold sm:inline">
            Meeting Planner
          </span>
          <span className="text-sm font-semibold sm:hidden">Planner</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        className="mt-0 min-h-0 flex-1 overflow-y-auto pb-4 data-[state=inactive]:hidden"
        forceMount
        value="converter"
      >
        <TimeConverter />
      </TabsContent>

      <TabsContent
        className="mt-0 min-h-0 flex-1 overflow-y-auto pb-4 data-[state=inactive]:hidden"
        forceMount
        value="planner"
      >
        <MeetingPlanner />
      </TabsContent>
    </Tabs>
  );
};
