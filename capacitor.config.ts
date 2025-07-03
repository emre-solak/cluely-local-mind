import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.588dce215b6d4df5848d7721890f7b9b',
  appName: 'cluely-local-mind',
  webDir: 'dist',
  server: {
    url: 'https://588dce21-5b6d-4df5-848d-7721890f7b9b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;