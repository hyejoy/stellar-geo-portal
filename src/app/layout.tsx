import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/src/styles/globals.css';
import Header from '@/src/app/components/ui/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StellarGeo — 위성 데이터 분석 플랫폼',
  description:
    'Sentinel 위성 데이터를 기반으로 NDVI 식생 분석과 SAR 레이더 분석을 제공하는 산업단지 모니터링 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} h-dvh antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
