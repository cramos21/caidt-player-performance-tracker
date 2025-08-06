import React from 'react';
import './App.css';
import { useBluetooth } from './hooks/useBluetooth';

function App() {
  const {
    scanForDevices,
    connectToDevice,
    disconnect,
    isConnected,
    isScanning,
    trackerData,
    debugInfo,
    connectedDevice,
  } = useBluetooth();

  const handleScan = async () => {
    console.log('🔍 Scan button clicked');
    const devices = await scanForDevices();

    if (devices.length === 1) {
      console.log('🎯 Auto-connecting to found device:', devices[0].name);
      await connectToDevice(devices[0]);
    } else if (devices.length > 1) {
      console.log('📱 Multiple devices found. Awaiting user to connect manually.');
    } else {
      console.log('❌ No devices found');
    }
  };

  return (
    <div className="App" style={{ fontFamily: 'monospace', padding: 20 }}>
      <h1>⚽ Player Performance Tracker</h1>

      {/* Scan Button */}
      <button onClick={handleScan} disabled={isScanning}>
        {isScanning ? '🔍 Scanning...' : '🔎 Scan for Devices'}
      </button>

      {/* Connect Button */}
      {!isConnected && connectedDevice && (
        <div style={{ marginTop: 10 }}>
          <p>🔌 Found device: {connectedDevice.name || 'Unnamed'}</p>
          <button onClick={() => connectToDevice(connectedDevice)}>Connect</button>
        </div>
      )}

      {/* Disconnect */}
      {isConnected && (
        <div style={{ marginTop: 10 }}>
          <p>✅ Connected to: {connectedDevice?.name || 'Device'}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}

      {/* Live Status */}
      <div style={{ marginTop: 20 }}>
        <h2>Status</h2>
        <ul>
          <li>🦿 Kicks: {trackerData.kicks}</li>
          <li>📏 Distance: {trackerData.distance} km</li>
          <li>⚡ Max Speed: {trackerData.speed} km/h</li>
          <li>⏱️ Session Time: {trackerData.sessionTime} min</li>
        </ul>
      </div>

      {/* Debug Log */}
      <div style={{ marginTop: 20 }}>
        <h2>Debug Log</h2>
        <div
          style={{
            background: '#f4f4f4',
            padding: 10,
            border: '1px solid #ccc',
            maxHeight: 200,
            overflowY: 'scroll',
            fontSize: 14,
            whiteSpace: 'pre-wrap',
          }}
        >
          {debugInfo.length === 0
            ? 'No debug messages yet.'
            : debugInfo.map((msg, i) => <div key={i}>{msg}</div>)}
        </div>
      </div>
    </div>
  );
}

export default App;