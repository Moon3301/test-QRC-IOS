import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qrc.app',
  appName: 'app-QRC',
  webDir: 'www',
  plugins: {
    "Camera": {
      "permissions": ["camera", "photos"]
    },
    "Filesystem": {
      "permissions": ["photos"]
    }
  }
};

export default config;
