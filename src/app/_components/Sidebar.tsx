'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const isSelected = (href: string) => pathname.includes(href);

  return (
    <nav className="w-64 h-full bg-gray-800 text-white">
      <ul>
        <li className={isSelected('/admin/posts') ? 'bg-gray-700' : ''}>
          <Link href="/admin/posts">
            <span className="block px-4 py-2">記事一覧</span>
          </Link>
        </li>
        <li className={isSelected('/admin/categories') ? 'bg-gray-700' : ''}>
          <Link href="/admin/categories">
            <span className="block px-4 py-2">カテゴリー一覧</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}