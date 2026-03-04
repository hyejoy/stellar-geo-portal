'use client';
import { create } from 'zustand';

// 수정 제안
interface ModalStore {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));

// 개별 선택자(Selector) 사용
export const useIsModalOpen = () => useModalStore((state) => state.isOpen);
export const useOpenDialog = () => useModalStore((state) => state.openDialog);
export const useCloseDialog = () => useModalStore((state) => state.closeDialog);
