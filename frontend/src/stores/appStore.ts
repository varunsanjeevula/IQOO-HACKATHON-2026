import { create } from 'zustand';

interface PrivacySettings {
  photos: boolean;
  documents: boolean;
  screenshots: boolean;
  sensitiveDocuments: boolean;
}

interface AppState {
  demoMode: boolean;
  privacySettings: PrivacySettings;
  setDemoMode: (enabled: boolean) => void;
  togglePrivacySetting: (key: keyof PrivacySettings) => void;
}

export const useAppStore = create<AppState>((set) => ({
  demoMode: true,
  privacySettings: {
    photos: true,
    documents: true,
    screenshots: true,
    sensitiveDocuments: false,
  },
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  togglePrivacySetting: (key) => set((state) => ({
    privacySettings: {
      ...state.privacySettings,
      [key]: !state.privacySettings[key],
    },
  })),
}));
