
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9d826bd1a7344b69bf9d547c42825625',
  appName: 'mobility-paths-navigator',
  webDir: 'dist',
  server: {
    url: 'https://9d826bd1-a734-4b69-bf9d-547c42825625.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Add any plugin configurations here
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
