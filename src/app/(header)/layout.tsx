import { ReactNode } from 'react';

export default function HeaderLayout({ children }: { children: ReactNode }) {
  return (
    // h-screen(100vh)을 주고, 넘치는 부분은 숨깁니다.
    <div className="bg-background flex h-screen w-full flex-col overflow-hidden">
      {/* 마진을 없애기 위해 m-0을 주거나 적절히 조절합니다. */}
      <h1 className="m-0 border-b p-4 text-xl font-bold">layout Component</h1>

      {/* 나머지 공간을 children이 꽉 채우도록 flex-1을 줍니다. */}
      <main className="relative flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
