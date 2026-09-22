import { create } from 'zustand';

interface PrivacySettings {
  photos: boolean;
  documents: boolean;
  screenshots: boolean;
  sensitiveDocuments: boolean;
}

interface AppState {
  demoMode: boolean;
  isPaused: boolean;
  privacySettings: PrivacySettings;
  setDemoMode: (enabled: boolean) => void;
  setPaused: (paused: boolean) => void;
  togglePrivacySetting: (key: keyof PrivacySettings) => void;
}

export const useAppStore = create<AppState>((set) => ({
  demoMode: true,
  isPaused: false,
  privacySettings: {
    photos: true,
    documents: true,
    screenshots: true,
    sensitiveDocuments: false,
  },
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  setPaused: (paused) => set({ isPaused: paused }),
  togglePrivacySetting: (key) => set((state) => ({
    privacySettings: {
      ...state.privacySettings,
      [key]: !state.privacySettings[key],
    },
  })),
}));
