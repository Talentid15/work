import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      email: null,
      emailVerified: false,
      verifiedDocuments: false,
      setUserData: ({ userId, email, emailVerified, verifiedDocuments }) =>
        set({ userId, email, emailVerified, verifiedDocuments }),
      setEmailVerified: (verified) => set({ emailVerified: verified }),
      setVerifiedDocuments: (verified) => set({ verifiedDocuments: verified }),
      clearUserData: () =>
        set({ userId: null, email: null, emailVerified: false, verifiedDocuments: false }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        emailVerified: state.emailVerified,
        verifiedDocuments: state.verifiedDocuments,
      }),
    }
  )
);

const useVerificationStore = create((set) => ({
  showOtpPopup: false,
  showDocumentPopup: false,
  failedRequest: null,
  is403Error: false,
  setOtpPopup: (show, failedRequest = null, is403Error = false) =>
    set({ showOtpPopup: show, failedRequest: show ? failedRequest : null, is403Error }),
  setDocumentPopup: (show, failedRequest = null, is403Error = false) =>
    set({ showDocumentPopup: show, failedRequest: show ? failedRequest : null, is403Error }),
}));

export { useUserStore, useVerificationStore };