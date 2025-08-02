import React, { useState, useRef } from 'react';
import { AppData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatDate } from './ui/utils';
import { Download, FileText, Database, Smartphone, Info, Shield, HelpCircle } from 'lucide-react';

interface MemoryCapsuleProps {
  appData: AppData;
  onNavigate: (screen: string) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
  onEraseAllData: () => void;
  onImportData: (data: Partial<AppData>) => void;
}

export function MemoryCapsule({ appData, onNavigate, deferredPrompt, setDeferredPrompt, onEraseAllData, onImportData }: MemoryCapsuleProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [eraseInput, setEraseInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [importStatus, setImportStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [bluetoothDevice, setBluetoothDevice] = useState<BluetoothDevice | null>(null);
  const [isBluetoothScanning, setIsBluetoothScanning] = useState(false);
  const [bluetoothStatus, setBluetoothStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [storageMetrics, setStorageMetrics] = useState<{
    familyFlowSize: number;
    totalSize: number;
    estimatedLimit: number;
    familyFlowPercentage: number;
    totalPercentage: number;
    browserType: string;
    storageType: string;
  } | null>(null);



  // Load storage metrics on component mount and when appData changes
  React.useEffect(() => {
    const loadStorageMetrics = async () => {
      try {
        const metrics = await getStorageMetrics();
        setStorageMetrics(metrics);
      } catch (error) {
        console.error('Failed to load storage metrics:', error);
      }
    };

    loadStorageMetrics();
  }, [appData]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallSuccess(true);
        setTimeout(() => setShowInstallSuccess(false), 3000);
      }
      setDeferredPrompt(null);
    }
  };

  const handleEraseConfirm = () => {
    if (eraseInput === 'delete') {
      onEraseAllData();
      setShowEraseConfirm(false);
      setEraseInput('');
    }
  };

  const generateCSV = () => {
    const csvData = [];
    csvData.push(['Type', 'Family Member', 'Date', 'Content', 'Details']);
    
    // Add mood entries
    appData.moodEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      csvData.push([
        'Mood',
        member?.name || 'Unknown',
        formatDate(entry.date),
        `${entry.emoji} (${entry.color})`,
        entry.note || ''
      ]);
    });
    
    // Add reflection entries
    appData.reflectionEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      csvData.push([
        'Reflection',
        member?.name || 'Unknown',
        formatDate(entry.date),
        entry.prompt,
        entry.response
      ]);
    });
    
    // Add gratitude entries
    appData.gratitudeEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      csvData.push([
        'Gratitude',
        member?.name || 'Unknown',
        formatDate(entry.date),
        entry.text,
        ''
      ]);
    });
    
    return csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };


  const generateFamilyFilename = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const familyName = appData.familyMembers.length > 0 
      ? appData.familyMembers[0].name.toLowerCase().replace(/[^a-z0-9]/gi, '') 
      : 'family';
    const entryCount = getTotalEntries();
    const dayCount = getUniqueDaysWithEntries();
    
    return `family-flow-${familyName}-${dayCount}days-${entryCount}entries-${timestamp}.${format}`;
  };

  const generateJSONExport = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: '2.0',
        totalEntries: getTotalEntries(),
        uniqueDays: getUniqueDaysWithEntries(),
        dateRange: getDateRange(),
        familyMembers: appData.familyMembers.length
      },
      familyData: {
        familyMembers: appData.familyMembers,
        moodEntries: appData.moodEntries,
        reflectionEntries: appData.reflectionEntries,
        gratitudeEntries: appData.gratitudeEntries,
        graduationMilestones: appData.graduationMilestones || [],
        graduationSettings: appData.graduationSettings || {}
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!exportFormat) return;
    
    setIsExporting(true);
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      if (exportFormat === 'csv') {
        const csvContent = generateCSV();
        const filename = generateFamilyFilename('csv');
        downloadFile(csvContent, filename, 'text/csv');
      } else if (exportFormat === 'json') {
        const jsonContent = generateJSONExport();
        const filename = generateFamilyFilename('json');
        downloadFile(jsonContent, filename, 'application/json');
      }
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        setExportFormat(null);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (file: File) => {
    setImportStatus(null);
    
    if (!file.name.endsWith('.json')) {
      setImportStatus({
        type: 'error',
        message: 'Please select a Family Flow JSON file (.json)'
      });
      return;
    }

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate the imported data structure
      if (!importedData.familyData || !importedData.metadata) {
        throw new Error('Invalid Family Flow file format');
      }

      const { familyData } = importedData;
      const entryCount = 
        (familyData.moodEntries?.length || 0) + 
        (familyData.reflectionEntries?.length || 0) + 
        (familyData.gratitudeEntries?.length || 0);
      
      const memberCount = familyData.familyMembers?.length || 0;
      
      const confirmed = confirm(
        `Import family data from ${importedData.metadata.dateRange}?\n\n` +
        `• ${entryCount} entries (mood, reflection, gratitude)\n` +
        `• ${memberCount} family members\n` +
        `• Exported: ${new Date(importedData.metadata.exportDate).toLocaleDateString()}\n\n` +
        `This will add new data to your existing family entries.`
      );

      if (confirmed) {
        onImportData(familyData);
        setImportStatus({
          type: 'success',
          message: `✅ Successfully imported ${entryCount} entries and ${memberCount} family members!`
        });
        
        setTimeout(() => setImportStatus(null), 5000);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus({
        type: 'error',
        message: 'Failed to import file. Please ensure it\'s a valid Family Flow JSON export.'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  // Platform detection
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasBluetooth = 'bluetooth' in navigator;
  const supportsBluetoothSync = isMobile && hasBluetooth;

  // Bluetooth sync functions
  const startBluetoothSharing = async () => {
    if (!supportsBluetoothSync || !hasDataForSync()) return;
    
    setBluetoothStatus(null);
    setIsBluetoothScanning(true);
    
    try {
      // Make device discoverable for Family Flow
      const exportData = generateJSONExport();
      const deviceName = `FamilyFlow-${appData.familyMembers[0]?.name || 'User'}`;
      
      setBluetoothStatus({
        type: 'info',
        message: `📡 Making ${deviceName} discoverable for family sync...`
      });
      
      // In a real implementation, this would:
      // 1. Start Bluetooth advertising with Family Flow service UUID
      // 2. Wait for connections from other Family Flow devices
      // 3. Transfer JSON data when connected
      
      // Simulated for demo (real implementation needs Bluetooth API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBluetoothStatus({
        type: 'success',
        message: '✅ Ready for family sync! Have another family member scan for nearby devices.'
      });
      
    } catch (error) {
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
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'FamilyFlow-' },
          { services: ['family-sync-service'] } // Custom service UUID would be used
        ],
        optionalServices: ['family-sync-service']
      });

      setBluetoothDevice(device);
      setBluetoothStatus({
        type: 'info',
        message: `📱 Connecting to ${device.name}...`
      });
      
      // Connect to device and sync data
      await connectAndSyncBluetooth(device);
      
    } catch (error: any) {
      console.error('Bluetooth scan failed:', error);
      if (error.name === 'NotFoundError') {
        setBluetoothStatus({
          type: 'error',
          message: 'No Family Flow devices found nearby. Make sure another family member is sharing.'
        });
      } else if (error.name === 'NotAllowedError') {
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
      // Connect to GATT server
      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to device');
      
      // Get Family Flow sync service
      const service = await server.getPrimaryService('family-sync-service');
      const characteristic = await service.getCharacteristic('family-data-characteristic');
      
      // Read family data from the device
      const value = await characteristic.readValue();
      const jsonData = new TextDecoder().decode(value);
      const importedData = JSON.parse(jsonData);
      
      // Validate and import data
      if (importedData.familyData && importedData.metadata) {
        const { familyData } = importedData;
        const entryCount = 
          (familyData.moodEntries?.length || 0) + 
          (familyData.reflectionEntries?.length || 0) + 
          (familyData.gratitudeEntries?.length || 0);
        
        const memberCount = familyData.familyMembers?.length || 0;
        
        const confirmed = confirm(
          `Sync family data from ${device.name}?\n\n` +
          `• ${entryCount} entries (mood, reflection, gratitude)\n` +
          `• ${memberCount} family members\n` +
          `• From: ${importedData.metadata.dateRange}\n\n` +
          `This will add new data to your existing family entries.`
        );

        if (confirmed) {
          onImportData(familyData);
          setBluetoothStatus({
            type: 'success',
            message: `✅ Successfully synced ${entryCount} entries from ${device.name}!`
          });
          
          setTimeout(() => setBluetoothStatus(null), 5000);
        }
      } else {
        throw new Error('Invalid data format received');
      }
      
    } catch (error) {
      console.error('Bluetooth sync failed:', error);
      setBluetoothStatus({
        type: 'error',
        message: 'Failed to sync data. Please try again.'
      });
    }
  };

  const getTotalEntries = () => {
    return appData.moodEntries.length + appData.reflectionEntries.length + appData.gratitudeEntries.length;
  };

  const getUniqueDaysWithEntries = () => {
    const uniqueDays = new Set<string>();
    
    // Add dates from mood entries
    appData.moodEntries.forEach(entry => {
      uniqueDays.add(entry.date);
    });
    
    // Add dates from reflection entries
    appData.reflectionEntries.forEach(entry => {
      uniqueDays.add(entry.date);
    });
    
    // Add dates from gratitude entries
    appData.gratitudeEntries.forEach(entry => {
      uniqueDays.add(entry.date);
    });
    
    
    return uniqueDays.size;
  };

  const getStorageMetrics = async () => {
    // Calculate Family Flow specific IndexedDB storage usage
    let familyFlowSize = 0;
    
    try {
      // Estimate IndexedDB storage usage
      const dataStr = JSON.stringify(appData);
      familyFlowSize = new Blob([dataStr]).size;
    } catch (error) {
      console.warn('Could not calculate IndexedDB storage size:', error);
      // Fallback to localStorage size if available
      const familyFlowData = localStorage.getItem('familyFlowData');
      familyFlowSize = familyFlowData ? new Blob([familyFlowData]).size : 0;
    }
    
    // Get browser storage quota (IndexedDB has much higher limits than localStorage)
    let estimatedLimit = 50 * 1024 * 1024; // Default 50MB estimate
    let quotaUsed = familyFlowSize;
    
    try {
      // Modern browsers support navigator.storage.estimate()
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota) {
          estimatedLimit = estimate.quota;
          quotaUsed = estimate.usage || familyFlowSize;
        }
      }
    } catch (error) {
      console.warn('Could not get storage quota:', error);
    }
    
    // Browser detection for display purposes
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const browserType = isIOS ? 'Safari (iOS)' : 'Chrome/Android';
    
    return {
      familyFlowSize,
      totalSize: quotaUsed,
      estimatedLimit,
      familyFlowPercentage: (familyFlowSize / estimatedLimit) * 100,
      totalPercentage: (quotaUsed / estimatedLimit) * 100,
      browserType,
      storageType: 'IndexedDB'
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDateRange = () => {
    const allDates = [
      ...appData.moodEntries.map(e => new Date(e.date)),
      ...appData.reflectionEntries.map(e => new Date(e.date)),
      ...appData.gratitudeEntries.map(e => new Date(e.date))
    ];
    
    if (allDates.length === 0) return 'No entries yet';
    
    const earliest = new Date(Math.min(...allDates.map(d => d.getTime())));
    const latest = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    return `${formatDate(earliest)} - ${formatDate(latest)}`;
  };

  const hasDataForExport = () => {
    return getUniqueDaysWithEntries() >= 5; // Require at least 5 days of entries to export
  };

  const hasDataForSync = () => {
    return getTotalEntries() > 0 || appData.familyMembers.length > 0; // Any data for sync
  };

  // Data size validation and compression helpers
  const getDataSize = (data: any): number => {
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString]).size;
  };

  const formatDataSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };


  if (exportComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-8xl mb-6">📦</div>
          <h2 className="text-3xl mb-4">Export Complete!</h2>
          <p className="text-gray-600 text-xl">Your memory capsule has been downloaded</p>
        </div>
      </div>
    );
  }

  if (showInstallSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-8xl mb-6">📱</div>
          <h2 className="text-3xl mb-4">FAMILY FLOW Installed!</h2>
          <p className="text-gray-600 text-xl">You can now use Family Flow from your home screen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-content relative">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-title text-2xl sm:text-4xl mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Memory
          </h1>
          <p className="text-gray-600 text-xl mb-3">Export your family's digital memories</p>
          <p className="text-sm text-gray-500 italic">Success means you won't need us forever - take your memories with you</p>
        </div>

        {/* Install App Section - Only show if prompt is available */}
        {deferredPrompt && (
          <Card className="p-4 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Add to your home screen for quick access
              </p>
              <Button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 max-[999px]:text-base max-[999px]:py-2 text-lg py-3 h-auto"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Add to Home Screen
              </Button>
            </div>
          </Card>
        )}

        {/* Data Summary */}
        <Card className="p-8 mb-10 bg-gradient-to-br from-indigo-50 to-purple-50">
          <h3 className="text-2xl mb-6">Your Family's Data</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Family Members</span>
              <span>{appData.familyMembers.length}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Mood Entries</span>
              <span>{appData.moodEntries.length}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Reflections</span>
              <span>{appData.reflectionEntries.length}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Gratitude Notes</span>
              <span>{appData.gratitudeEntries.length}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-medium text-xl">
                <span>Total Entries</span>
                <span>{getTotalEntries()}</span>
              </div>
              <div className="text-lg text-gray-500 mt-2">
                {getDateRange()}
              </div>
            </div>
            
            {/* Storage Metrics */}
            {storageMetrics && (
              <div className="border-t pt-4 mt-4">
                <div className="mb-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Family Flow Storage ({storageMetrics.storageType})</span>
                    <span className="font-medium">{formatBytes(storageMetrics.familyFlowSize)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(storageMetrics.familyFlowPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </Card>



        {!exportFormat && (
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <h3 className="text-2xl mr-3">Export your Family data</h3>
              <button
                onClick={() => setShowExportHelp(!showExportHelp)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Why export family data?"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* 5-day rule hint */}
            {!hasDataForExport() && (
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                <p className="text-orange-700 text-sm">
                  <span className="font-medium">Export unlocks after 5 days of family entries</span> • 
                  This ensures your exported data represents meaningful connection patterns
                </p>
              </div>
            )}
            
            {showExportHelp && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-medium text-blue-800">Why export your family data?</h4>
                  <button
                    onClick={() => setShowExportHelp(false)}
                    className="text-blue-600 hover:text-blue-800 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <ul className="text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Create backups of your precious family memories</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Share insights with family therapists or counselors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Print physical journals or create scrapbooks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Track long-term family patterns and growth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span>Keep records safe before device changes</span>
                  </li>
                </ul>
              </div>
            )}
            <div className="space-y-4">
              <button
                onClick={() => hasDataForExport() && setExportFormat('csv')}
                disabled={!hasDataForExport()}
                className={`w-full p-6 rounded-2xl border-3 transition-colors text-left ${
                  hasDataForExport() 
                    ? 'border-gray-200 hover:border-indigo-300 cursor-pointer' 
                    : 'border-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <FileText className={`w-8 h-8 ${hasDataForExport() ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <div className={`font-medium text-lg ${hasDataForExport() ? 'text-gray-900' : 'text-gray-400'}`}>
                      CSV Spreadsheet
                    </div>
                    <div className={`text-base ${hasDataForExport() ? 'text-gray-600' : 'text-gray-400'}`}>
                      {hasDataForExport() ? 'Open in Excel, Google Sheets, etc.' : `${getUniqueDaysWithEntries()}/5 days needed to export`}
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => hasDataForSync() && setExportFormat('json')}
                disabled={!hasDataForSync()}
                className={`w-full p-6 rounded-2xl border-3 transition-colors text-left ${
                  hasDataForSync() 
                    ? 'border-gray-200 hover:border-orange-300 cursor-pointer' 
                    : 'border-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Database className={`w-8 h-8 ${hasDataForSync() ? 'text-orange-600' : 'text-gray-400'}`} />
                  <div>
                    <div className={`font-medium text-lg ${hasDataForSync() ? 'text-gray-900' : 'text-gray-400'}`}>
                      Family Sync File (JSON)
                    </div>
                    <div className={`text-base ${hasDataForSync() ? 'text-gray-600' : 'text-gray-400'}`}>
                      {hasDataForSync() ? 'Share with family devices • Perfect for desktop/mobile sync' : 'Add some family entries first'}
                    </div>
                  </div>
                </div>
              </button>
              
              {/* PDF Export temporarily hidden
              <button
                onClick={() => hasData() && setExportFormat('pdf')}
                disabled={!hasData()}
                className={`w-full p-6 rounded-2xl border-3 transition-colors text-left ${
                  hasData() 
                    ? 'border-gray-200 hover:border-indigo-300 cursor-pointer' 
                    : 'border-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <FileText className={`w-8 h-8 ${hasData() ? 'text-red-600' : 'text-gray-400'}`} />
                  <div>
                    <div className={`font-medium text-lg ${hasData() ? 'text-gray-900' : 'text-gray-400'}`}>
                      Memory Book PDF
                    </div>
                    <div className={`text-base ${hasData() ? 'text-gray-600' : 'text-gray-400'}`}>
                      {hasData() ? 'Beautiful family keepsake document' : 'Add some family entries first'}
                    </div>
                  </div>
                </div>
              </button>
              */}
            </div>
            
            {/* Bluetooth Sync Section - Mobile Only */}
            {supportsBluetoothSync && (
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4 text-gray-800">📱 Mobile Bluetooth Sync</h4>
                
                {bluetoothStatus && (
                  <div className={`mb-4 p-4 rounded-lg border ${
                    bluetoothStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    bluetoothStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {bluetoothStatus.message}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={startBluetoothSharing}
                    disabled={!hasDataForSync() || isBluetoothScanning}
                    variant="outline"
                    className="h-auto py-4 px-6 flex flex-col items-center space-y-2"
                  >
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div className="text-center">
                      <div className="font-medium">Share via Bluetooth</div>
                      <div className="text-sm text-gray-600">
                        {isBluetoothScanning ? 'Making discoverable...' : 'Make this device discoverable'}
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={scanForBluetoothDevices}
                    disabled={isBluetoothScanning}
                    variant="outline"
                    className="h-auto py-4 px-6 flex flex-col items-center space-y-2"
                  >
                    <Database className="w-6 h-6 text-green-600" />
                    <div className="text-center">
                      <div className="font-medium">Receive via Bluetooth</div>
                      <div className="text-sm text-gray-600">
                        {isBluetoothScanning ? 'Scanning for devices...' : 'Find nearby family devices'}
                      </div>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>How it works:</strong> One family member shares, another receives. 
                    Both devices need Bluetooth enabled and be within 30 feet of each other.
                  </p>
                </div>
              </div>
            )}

            {/* Platform-specific guidance for non-Bluetooth devices */}
            {!supportsBluetoothSync && (
              <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-800 mb-2">💻 Desktop & Non-Bluetooth Devices</h5>
                <p className="text-amber-700 text-sm">
                  You're using a desktop computer or device without Bluetooth sync support. 
                  Use the <strong>JSON file export/import</strong> method below to share family data between devices.
                </p>
              </div>
            )}

            {/* Import Section */}
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-gray-800">
                📥 Import Family Data
                {!supportsBluetoothSync && <span className="text-sm text-gray-500 ml-2">(Desktop/File Method)</span>}
              </h4>
              
              {importStatus && (
                <div className={`mb-4 p-4 rounded-lg border ${
                  importStatus.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {importStatus.message}
                </div>
              )}
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-2">
                  <span className="text-lg font-medium text-gray-700">
                    {isDragOver ? 'Drop your Family Flow file here' : 'Import from Family Flow JSON file'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Drag and drop your family-flow-*.json file here, or click to browse
                </p>
                <div className="text-sm text-gray-500">
                  💡 {supportsBluetoothSync 
                    ? 'Universal method • Works on all devices • Great for desktop sync' 
                    : 'Perfect for desktop computers • Drag and drop support'}
                </div>
                
                <input
                  id="file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {exportFormat && (
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setExportFormat(null)}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
                disabled={isExporting}
              >
                ← Back
              </button>
              <h3 className="text-2xl">
                {exportFormat === 'csv' ? 'Export as CSV Spreadsheet' : 'Export Family Sync File'}
              </h3>
            </div>

            <Card className="p-8 mb-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 mb-6 text-lg">
                  Ready to export {getTotalEntries()} entries as {exportFormat.toUpperCase()}
                </p>
                <p className="text-base text-gray-500">
                  Your data will be downloaded directly to your device. No data is sent to any servers.
                </p>
              </div>
            </Card>

            <Button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 max-[999px]:text-lg max-[999px]:py-3 text-xl py-4 h-auto"
              disabled={isExporting}
            >
              {isExporting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Exporting...
                </div>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-3" />
                  Download Export
                </>
              )}
            </Button>
          </div>
        )}

        {/* About Section */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => onNavigate('about')}
            variant="outline"
            className="w-full max-[999px]:text-base max-[999px]:py-3 text-lg py-4 h-auto"
          >
            <Info className="w-5 h-5 mr-3" />
            About Family Flow
          </Button>
        </div>

        <div className="text-center text-lg text-gray-500 mb-8">
          <p>🔒 All exports happen offline</p>
          <p>Your family's data never leaves your device</p>
        </div>

        {/* Erase Data Button - Only show if data exists */}
        {hasDataForSync() && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowEraseConfirm(true)}
              className="text-xs text-red-600 hover:text-red-700 transition-colors px-2 py-1"
            >
              Erase All Data
            </button>
          </div>
        )}
      </div>

      {/* Erase Data Confirmation Modal */}
      {showEraseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-red-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-bold">Erase All Data</h3>
                </div>
                <button
                  onClick={() => {
                    setShowEraseConfirm(false);
                    setEraseInput('');
                  }}
                  className="text-white/80 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-800 mb-4 font-medium">
                  This will permanently delete all your family's data:
                </p>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>All mood entries ({appData.moodEntries.length} entries)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>All reflections ({appData.reflectionEntries.length} entries)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>All gratitude notes ({appData.gratitudeEntries.length} entries)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Family member profiles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Graduation progress</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm font-medium mb-2">
                  💡 Consider exporting your data first!
                </p>
                <p className="text-amber-700 text-sm">
                  This action cannot be undone. Your family's memories will be lost forever.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type "delete" to confirm:
                </label>
                <input
                  type="text"
                  value={eraseInput}
                  onChange={(e) => setEraseInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="delete"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleEraseConfirm}
                  disabled={eraseInput !== 'delete'}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    eraseInput === 'delete'
                      ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Erase All Data
                </button>
                
                <button
                  onClick={() => {
                    setShowEraseConfirm(false);
                    setEraseInput('');
                  }}
                  className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}