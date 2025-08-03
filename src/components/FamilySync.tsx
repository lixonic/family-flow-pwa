import React, { useState } from 'react';
import { AppData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Smartphone, Users, Info, HelpCircle } from 'lucide-react';

interface FamilySyncProps {
  appData: AppData;
  onNavigate: (screen: string) => void;
  onImportData: (data: Partial<AppData>) => void;
}

export function FamilySync({ appData, onNavigate, onImportData }: FamilySyncProps) {
  const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
  const [bluetoothStatus, setBluetoothStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  // Check mobile and bluetooth support
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasBluetooth = 'bluetooth' in navigator;
  const supportsBluetoothSync = isMobile && hasBluetooth;

  // Calculate data metrics
  const getTotalEntries = () => {
    return appData.moodEntries.length + appData.reflectionEntries.length + appData.gratitudeEntries.length;
  };

  const hasDataForSync = () => {
    return getTotalEntries() > 0 || appData.familyMembers.length > 0; // Any data for sync
  };


  // Bluetooth sync functions
  const startBluetoothSharing = async () => {
    if (!supportsBluetoothSync || !hasDataForSync()) return;
    
    setBluetoothStatus(null);
    setIsBluetoothScanning(true);
    
    try {
      // Make device discoverable for Family Flow
      const deviceName = `FamilyFlow-${appData.familyMembers[0]?.name || 'User'}`;
      
      setBluetoothStatus({
        type: 'info',
        message: `📡 Making ${deviceName} discoverable for family sync...`
      });
      
      // Simulated Bluetooth implementation
      // 1. Start Bluetooth advertising with Family Flow service UUID
      // 2. Wait for connection requests from other Family Flow apps
      // 3. Share family data when connected
      
      // Simulated for demo (real implementation needs Bluetooth API)
      setTimeout(() => {
        setBluetoothStatus({
          type: 'success',
          message: '✅ Ready for family sync! Have another family member scan for nearby devices.'
        });
      }, 2000);
      
    } catch (error: unknown) {
      console.error('Bluetooth sharing failed:', error);
      setBluetoothStatus({
        type: 'error',
        message: 'Failed to start Bluetooth sharing. Make sure Bluetooth is enabled.'
      });
    } finally {
      setIsBluetoothScanning(false);
    }
  };

  const scanForBluetoothDevices = async () => {
    if (!supportsBluetoothSync) return;
    
    setBluetoothStatus(null);
    setIsBluetoothScanning(true);
    
    try {
      // For demo purposes, show device picker but explain limitation
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'device_information']
      });

      setBluetoothStatus({
        type: 'info',
        message: `📱 Found ${device.name}. Checking for Family Flow compatibility...`
      });
      
      // Simulate checking for Family Flow service (would fail in real implementation)
      setTimeout(() => {
        setBluetoothStatus({
          type: 'error',
          message: `❌ ${device.name} doesn't have Family Flow data sharing enabled. Both devices need to run Family Flow with Bluetooth sharing active.`
        });
      }, 2000);
      
    } catch (error: unknown) {
      console.error('Bluetooth scan failed:', error);
      if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFoundError') {
        setBluetoothStatus({
          type: 'error',
          message: 'No Family Flow devices found nearby. Make sure another family member is sharing.'
        });
      } else if (error && typeof error === 'object' && 'name' in error && error.name === 'NotAllowedError') {
        setBluetoothStatus({
          type: 'error',
          message: 'Bluetooth access denied. Please allow Bluetooth permissions.'
        });
      } else {
        setBluetoothStatus({
          type: 'error',
          message: 'Bluetooth connection failed. Make sure Bluetooth is enabled.'
        });
      }
    } finally {
      setIsBluetoothScanning(false);
    }
  };

  const connectAndSyncBluetooth = async (device: BluetoothDevice) => {
    try {
      // Connect to the Bluetooth device
      const server = await device.gatt?.connect();
      
      if (!server) {
        throw new Error('Could not connect to device');
      }

      // Get the Family Flow service  
      const familySyncServiceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
      const familyDataCharUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
      const service = await server.getPrimaryService(familySyncServiceUUID);
      
      // Read family data from the other device
      const dataCharacteristic = await service.getCharacteristic(familyDataCharUUID);
      const dataValue = await dataCharacteristic.readValue();
      
      // Parse the received data
      const decoder = new TextDecoder();
      const receivedDataString = decoder.decode(dataValue);
      const receivedData = JSON.parse(receivedDataString);
      
      // Import the received data
      onImportData(receivedData);
      
      setBluetoothStatus({
        type: 'success',
        message: `✅ Successfully synced family data from ${device.name}!`
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setBluetoothStatus(null), 5000);
      
      // Disconnect
      server.disconnect();
      
    } catch (error: unknown) {
      console.error('Bluetooth sync failed:', error);
      setBluetoothStatus({
        type: 'error',
        message: 'Failed to sync data. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => onNavigate('memory')}
            variant="ghost"
            className="mb-4 p-0 h-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Memory Capsule
          </Button>
          
          <h2 className="font-title text-3xl text-gray-900 mb-2">
            Family Sync
          </h2>
          <p className="text-gray-600">
            Share your family's journey with other devices securely
          </p>
        </div>

        {/* Family Data Overview */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-blue-900">Your Family Data</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Family Members:</span>
              <span className="font-medium text-blue-800">{appData.familyMembers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Total Entries:</span>
              <span className="font-medium text-blue-800">{getTotalEntries()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Mood Check-ins:</span>
              <span className="font-medium text-blue-800">{appData.moodEntries.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Reflections:</span>
              <span className="font-medium text-blue-800">{appData.reflectionEntries.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Gratitude Entries:</span>
              <span className="font-medium text-blue-800">{appData.gratitudeEntries.length}</span>
            </div>
          </div>
        </Card>

        {/* Bluetooth Sync Section - Mobile Only */}
        {supportsBluetoothSync && (
          <Card className="p-6 mb-6">
            <h4 className="text-lg font-medium mb-4 text-gray-800">📱 Mobile Bluetooth Sync</h4>
            
            {bluetoothStatus && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${
                bluetoothStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                bluetoothStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              } border`}>
                {bluetoothStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 mb-4">
              <Button
                onClick={startBluetoothSharing}
                disabled={!hasDataForSync() || isBluetoothScanning}
                className="flex flex-col items-center p-6 h-auto bg-blue-500 hover:bg-blue-600"
              >
                <Smartphone className="w-8 h-8 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Share via Bluetooth</div>
                  <div className="text-sm opacity-90">
                    {isBluetoothScanning ? 'Making discoverable...' : 'Make this device discoverable'}
                  </div>
                </div>
              </Button>

              <Button
                onClick={scanForBluetoothDevices}
                disabled={isBluetoothScanning}
                variant="outline"
                className="flex flex-col items-center p-6 h-auto border-blue-200 hover:bg-blue-50"
              >
                <Users className="w-8 h-8 mb-2 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Receive via Bluetooth</div>
                  <div className="text-sm text-gray-600">
                    {isBluetoothScanning ? 'Scanning for devices...' : 'Find nearby family devices'}
                  </div>
                </div>
              </Button>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start">
                <Info className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  Both devices need Bluetooth enabled and be within 30 feet of each other.
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Platform-specific guidance for non-Bluetooth devices */}
        {!supportsBluetoothSync && (
          <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
            <h5 className="font-medium text-amber-800 mb-2">💻 Desktop & Non-Bluetooth Devices</h5>
            <p className="text-sm text-amber-700 mb-4">
              You're using a desktop computer or device without Bluetooth sync support. 
              Use the file export/import method in the Memory Capsule to share data between devices.
            </p>
            <Button
              onClick={() => onNavigate('memory')}
              variant="outline"
              className="border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              Go to File Export
            </Button>
          </Card>
        )}

        {/* Help Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-3">
            <HelpCircle className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-800">How Family Sync Works</h4>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong className="text-gray-800">Privacy-First:</strong> All data transfer happens directly between your devices. No cloud servers involved.
            </div>
            <div>
              <strong className="text-gray-800">Bluetooth Sync:</strong> Available on mobile devices for nearby family members to share data instantly.
            </div>
            <div>
              <strong className="text-gray-800">File Sync:</strong> Export data as files to share via email, messaging, or cloud storage.
            </div>
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-gray-500 mb-8">
          <p>🔒 All syncing happens offline</p>
          <p>Your family's data never touches external servers</p>
        </div>
      </div>
    </div>
  );
}