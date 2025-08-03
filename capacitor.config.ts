import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.99f62b7319e4491192b37c7d3651fa71',
  appName: 'caidt-player-performance-tracker',
  webDir: 'dist',
  server: {
    url: 'https://99f62b73-19e4-4911-92b3-7c7d3651fa71.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for soccer tracker...",
        cancel: "Cancel",
        availableDevices: "Available devices",
        noDeviceFound: "No devices found"
      }
    }
  }
};

export default config;