import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Settings' };
export const instant = false;
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Account</h2>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">User ID</p>
          <p className="text-xs font-mono text-gray-600 break-all">{user.id}</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Account Created
          </p>
          <p className="text-sm text-gray-900">
            {new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-sm font-medium text-amber-800 mb-1">Seed Data</p>
        <p className="text-xs text-amber-700">
          To add sample candidates, run the SQL in{' '}
          <code className="bg-amber-100 px-1 rounded font-mono">
            supabase/migrations/002_seed_data.sql
          </code>{' '}
          in your Supabase SQL Editor after replacing{' '}
          <code className="bg-amber-100 px-1 rounded font-mono">
            YOUR_USER_ID_HERE
          </code>{' '}
          with:{' '}
          <span className="font-mono font-semibold text-amber-900 break-all">
            {user.id}
          </span>
        </p>
      </div>
    </div>
  );
}
