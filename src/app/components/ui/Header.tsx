'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isDetailPage = pathname !== '/analysis';

  return (
    <header className="flex h-[64px] items-center justify-between border-b border-white/10 bg-black/70 px-6 backdrop-blur-md">
      {/* logo */}
      <div className="flex items-center gap-4">
        <Link href="/analysis" className="flex items-center gap-2">
          <Image src="/logo/satellite.png" alt="logo" width={26} height={26} />

          <h1 className="text-lg font-semibold tracking-wide text-white">Stellar Geo Portal</h1>
        </Link>
      </div>

      {/* right actions */}
      <div className="flex items-center gap-4">
        {isDetailPage && (
          <button
            onClick={() => router.back()}
            className="rounded-md bg-white/5 p-2 text-white hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
