import { create } from "zustand";

const useUserStore = create((set) => ({
  userId: null,
  email: null,
  setUserData: ({ userId, email }) => set({ userId, email }),
  clearUserData: () => set({ userId: null, email: null }),
}));

const useVerificationStore = create((set) => ({
  showOtpPopup: false,
  showDocumentPopup: false,
  failedRequest: null,
  setOtpPopup: (show, failedRequest = null) =>
    set({ showOtpPopup: show, failedRequest: show ? failedRequest : null }),
  setDocumentPopup: (show, failedRequest = null) =>
    set({ showDocumentPopup: show, failedRequest: show ? failedRequest : null }),
}));

export {useUserStore , useVerificationStore};