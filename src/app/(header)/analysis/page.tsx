'use client';
import LeftPanel from '@/src/app/(header)/analysis/leftPanel';
import OrderModal from '@/src/app/components/OrderModal';
import { useIsModalOpen } from '@/src/app/store/modalStore';
import dynamic from 'next/dynamic';

const BasicMap = dynamic(() => import('@/src/app/components/BasicMap'), {
  ssr: false,
});

export default function Page() {
  const isOpen = useIsModalOpen();
  return (
    <>
      <div className="flex h-screen">
        {/* 좌측 패널 */}
        <LeftPanel />

        {/* 맵 패널 */}
        <div className="flex-1">
          <BasicMap />
        </div>
      </div>

      {/* 모달 */}
      {isOpen && <OrderModal />}
    </>
  );
}
