'use client';

import { AppShell } from '@/components/layout/AppShell';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/candidates': 'Candidates',
  '/settings': 'Settings',
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/candidates/')) return 'Candidate Details';
  return 'EarlyJobs ATS';
}

interface AppShellProviderProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AppShellProvider({ children, userEmail }: AppShellProviderProps) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <AppShell pageTitle={title} userEmail={userEmail}>
      {children}
    </AppShell>
  );
}
