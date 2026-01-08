/**
 * Time Bridge - Time Converter & Meeting Planner App
 */

import { Header, MainTabs } from '@/components/layout';
import { ThemeProvider } from '@/components/theme';

const App = () => {
  return (
    <ThemeProvider>
      <div className="bg-background relative flex h-dvh flex-col overflow-hidden">
        {/* Background gradient mesh */}
        <div className="bg-gradient-mesh pointer-events-none fixed inset-0" />

        <Header />

        <main
          className="relative z-10 container mx-auto flex min-h-0 flex-1 flex-col px-4 py-4"
          role="main"
        >
          <MainTabs />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
