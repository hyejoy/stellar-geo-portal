'use client';
import LeftPanel from '@/src/app/(header)/analysis/leftPanel';
import OrderModal from '@/src/app/components/OrderModal';
import { useCloseDialog, useIsModalOpen } from '@/src/app/store/modalStore';
import { formatCurrency } from '@/src/utils/format';
import { calculateAnalysisPrice } from '@/src/utils/geo';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const BasicMap = dynamic(() => import('@/src/app/components/BasicMap'), {
  ssr: false,
});

export default function Page() {
  const [landArea, setLangArea] = useState(0);
  const [price, setPrice] = useState('');

  const handleLangArea = (area: number) => {
    setLangArea(area);
  };

  const handlePrice = (price: string) => {
    setPrice(price);
  };

  useEffect(() => {
    const price = calculateAnalysisPrice(landArea);
    const formatedPrice = formatCurrency(price);
    setPrice(formatedPrice);
  }, [landArea]);

  const isOpen = useIsModalOpen();
  const closeModal = useCloseDialog();
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
