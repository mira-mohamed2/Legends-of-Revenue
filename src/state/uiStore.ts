import { create } from 'zustand';
import type { ModalType, NotificationState } from '../types/ui';

interface UIState {
  activeModal: ModalType | null;
  notification: NotificationState | null;
  isLoading: boolean;
  
  // Actions
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  showNotification: (notification: NotificationState) => void;
  clearNotification: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  notification: null,
  isLoading: false,
  
  openModal: (modal) => {
    set({ activeModal: modal });
  },
  
  closeModal: () => {
    set({ activeModal: null });
  },
  
  showNotification: (notification) => {
    set({ notification });
    
    // Auto-clear after 3 seconds
    setTimeout(() => {
      set({ notification: null });
    }, 3000);
  },
  
  clearNotification: () => {
    set({ notification: null });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
