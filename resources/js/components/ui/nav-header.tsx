// resources/js/components/ui/nav-header.tsx

import { Link } from '@inertiajs/react';

export default function NavHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-[#0A66C2]">
          Where's My Dorm
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex gap-6 text-sm font-medium text-gray-700 items-center">
          <Link href={route('dorm.messages.index')} className="hover:text-[#0A66C2]">
            Messages
          </Link>
          <Link href={route('dorm.transactions.history')} className="hover:text-[#0A66C2]">
            Transactions
          </Link>
          <Link href={route('dorm.posts.history')} className="hover:text-[#0A66C2]">
            Posts
          </Link>
          <Link href={route('dorm.analytics.revenue')} className="hover:text-[#0A66C2]">
            Analytics
          </Link>
          <Link href="#" className="hover:text-[#0A66C2]">
            Notifications
          </Link>
        </nav>
      </div>
    </header>
  );
}
