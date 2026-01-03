'use client';

import { AppShell } from '@/components/layout/app-shell';
import { NewsAnalysis } from '@/components/news/news-analysis';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/context/theme-provider';

export default function NewsPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppShell>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-4 md:gap-8">
              <NewsAnalysis />
            </div>
          </main>
        </AppShell>
      </SidebarProvider>
    </ThemeProvider>
  );
}
