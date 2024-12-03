import { create } from 'zustand';

interface CheckoutModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useCheckoutModal = create<CheckoutModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useCheckoutModal;
