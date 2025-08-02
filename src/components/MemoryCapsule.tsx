import React, { useState } from 'react';
import { AppData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatDate } from './ui/utils';
import { Download, FileText, Database, Info, HelpCircle, Users, Smartphone } from 'lucide-react';

interface MemoryCapsuleProps {
  appData: AppData;
  onNavigate: (screen: string) => void;
  deferredPrompt: Event | null;
  setDeferredPrompt: (prompt: Event | null) => void;
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

  // Helper functions

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


        {!exportFormat && (
          <div className="mb-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">📱 Share Your Family Memories</h3>
              <p className="text-xl text-gray-700">Choose how you'd like to save or share</p>
            </div>
            
            <div className="space-y-4">
              {/* Share with Family - Big Simple Button */}
              <Button
                onClick={() => onNavigate('family-sync')}
                className="w-full p-8 h-auto bg-blue-500 hover:bg-blue-600 text-white rounded-3xl"
              >
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-2">Share with Family</div>
                  <div className="text-lg text-blue-100">Send to other phones instantly</div>
                </div>
              </Button>

              {/* Download File - Simple Button */}
              {hasDataForSync() && (
                <Button
                  onClick={() => setExportFormat('json')}
                  className="w-full p-8 h-auto bg-green-500 hover:bg-green-600 text-white rounded-3xl"
                >
                  <div className="text-center">
                    <Download className="w-16 h-16 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-2">Download File</div>
                    <div className="text-lg text-green-100">Save to your device</div>
                  </div>
                </Button>
              )}

              {/* Import File - Simple Button */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
                className={`w-full p-8 rounded-3xl border-4 border-dashed cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <div className="text-center">
                  <Database className="w-16 h-16 mx-auto mb-3 text-orange-500" />
                  <div className="text-2xl font-bold mb-2 text-gray-800">
                    {isDragOver ? 'Drop File Here!' : 'Add Family Memories'}
                  </div>
                  <div className="text-lg text-gray-600">
                    Click or drag a Family Flow file here
                  </div>
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

            {/* Success/Error Messages */}
            {importStatus && (
              <div className={`mt-6 p-4 rounded-xl text-center text-lg font-medium ${
                importStatus.type === 'success' 
                  ? 'bg-green-100 border-2 border-green-300 text-green-800' 
                  : 'bg-red-100 border-2 border-red-300 text-red-800'
              }`}>
                {importStatus.message}
              </div>
            )}
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