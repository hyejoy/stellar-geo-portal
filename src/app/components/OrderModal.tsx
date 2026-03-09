'use client';

import {
  useAnalysisActions,
  useAreaPrice,
  useLandArea,
  useSelectedArea,
  useSelectedBbox,
  useSelectedYears,
} from '@/src/app/store/analysisStore';
import { useCloseDialog, useIsModalOpen } from '@/src/app/store/modalStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/src/app/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { AREAS } from '@/src/constants/areas';

type ModalStep = 'confirm' | 'loading' | 'success' | 'error';

export default function OrderModal() {
  const router = useRouter();

  const area = useSelectedArea();
  const bbox = useSelectedBbox();
  const selectedArea = useSelectedArea();
  const landArea = useLandArea();
  const price = useAreaPrice();
  const { selectedStartYear, selectedEndYear } = useSelectedYears();

  const isOpen = useIsModalOpen();
  const onClose = useCloseDialog();
  const { setAnalysisOrder } = useAnalysisActions();

  const [step, setStep] = useState<ModalStep>('confirm');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  // 성공 후 카운트다운 → 자동 이동
  useEffect(() => {
    if (step !== 'success' || !orderId) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          router.push(`/result/${orderId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, orderId]);

  const handleOrder = async () => {
    setStep('loading');
    try {
      const res = await fetch('/api/analysis/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bbox,
          landArea,
          startYear: selectedStartYear ?? new Date().getFullYear() - 1,
          endYear: selectedEndYear ?? new Date().getFullYear(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? '주문 요청에 실패했습니다.');
        setStep('error');
        return;
      }

      setAnalysisOrder({
        area,
        bbox,
        landArea,
        price,
        startYear: selectedStartYear ?? new Date().getFullYear() - 1,
        endYear: selectedEndYear ?? new Date().getFullYear(),
        orderedAt: new Date().toISOString(),
      });

      setOrderId(data.orderId);
      setStep('success');
    } catch (err) {
      setErrorMsg('주문 요청 중 오류가 발생했습니다.');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setErrorMsg(null);
    setOrderId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* 배경 블러 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 'loading' ? undefined : handleClose}
      />

      {/* 모달 */}
      <div className="relative z-10 w-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#1B1F2A] text-white shadow-2xl">
        {/* ── CONFIRM ── */}
        {step === 'confirm' && (
          <>
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">🛒 주문 확인</div>
              <button
                onClick={handleClose}
                className="cursor-pointer text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <p className="text-sm text-white/70">
                선택한 영역에 대한 분석 데이터를 주문하시겠습니까?
              </p>

              <div className="space-y-2 rounded-lg bg-white/5 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">선택 지역</span>
                  <span>{AREAS[selectedArea].name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">면적</span>
                  <span>{landArea} km²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">예상 가격</span>
                  <span className="font-semibold text-yellow-400">₩ {price}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold">
                  <span>총 결제 금액</span>
                  <span className="text-yellow-400">₩ {price}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={handleClose}
                className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
              >
                취소
              </button>
              <button
                onClick={handleOrder}
                className="rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600"
              >
                주문하기
              </button>
            </div>
          </>
        )}

        {/* ── LOADING ── */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-16">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <p className="text-base font-semibold text-white">주문을 처리하고 있습니다</p>
              <p className="mt-1 text-sm text-white/40">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center gap-6 px-6 py-14">
            {/* 체크 아이콘 */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15 ring-2 ring-yellow-500/40">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M7 16.5l6 6 12-12"
                  stroke="#EAB308"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-white">주문이 완료되었습니다</p>
              <p className="mt-1 text-sm text-white/50">
                {countdown}초 후 분석 결과 페이지로 이동합니다
              </p>
            </div>

            {/* 카운트다운 프로그레스 바 */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-1000 ease-linear"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              />
            </div>

            <button
              onClick={() => {
                onClose();
                router.push(`/result/${orderId}`);
              }}
              className="text-sm text-white/40 underline underline-offset-2 hover:text-white/70"
            >
              지금 바로 이동
            </button>
          </div>
        )}

        {/* ── ERROR ── */}
        {step === 'error' && (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-2 ring-red-500/40">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M8 8l12 12M20 8L8 20"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-base font-semibold text-white">주문에 실패했습니다</p>
              <p className="mt-1 text-sm text-white/50">{errorMsg}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
              >
                닫기
              </button>
              <button
                onClick={() => setStep('confirm')}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-600"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
