
'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Settings } from '@/components/settings/settings';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/context/theme-provider';

export default function SettingsPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppShell>
          <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
            <div className="w-full max-w-2xl">
              <Settings />
            </div>
          </main>
        </AppShell>
      </SidebarProvider>
    </ThemeProvider>
  );
}
