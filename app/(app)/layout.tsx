import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppShellProvider } from '@/components/layout/AppShellProvider';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <AppShellProvider userEmail={user.email}>{children}</AppShellProvider>
  );
}
