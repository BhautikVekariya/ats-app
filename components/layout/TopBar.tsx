
'use client';

import { useRouter } from 'next/navigation';
import { Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

interface TopBarProps {
  title: string;
  userEmail?: string;
  onMenuClick?: () => void;
}

export function TopBar({
  title,
  userEmail,
  onMenuClick,
}: TopBarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out failed:', error.message);
        setLoggingOut(false);
        return;
      }

      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Sign out failed:', error);
      setLoggingOut(false);
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left: navigation menu and page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Right: notifications and profile */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            id="profile-menu-trigger"
            className="flex items-center gap-2 rounded-lg px-2 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-600" />
            </div>

            <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">
              {userEmail ?? 'Account'}
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            {userEmail && (
              <>
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-500">
                    Signed in as
                  </p>

                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userEmail}
                  </p>
                </div>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
              onClick={handleLogout}
              disabled={loggingOut}
              id="logout-button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
