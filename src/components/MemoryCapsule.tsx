import React, { useState } from 'react';
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
}

export function MemoryCapsule({ appData, onNavigate, deferredPrompt, setDeferredPrompt, onEraseAllData }: MemoryCapsuleProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [eraseInput, setEraseInput] = useState('');

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

  const generateJSON = () => {
    return JSON.stringify(appData, null, 2);
  };

  const generatePDF = () => {
    // In a real app, you'd use a library like jsPDF
    // For now, we'll create a simple text report
    let pdfContent = 'FAMILY FLOW MEMORY CAPSULE\n';
    pdfContent += '='.repeat(40) + '\n\n';
    
    pdfContent += `Export Date: ${formatDate(new Date())}\n`;
    pdfContent += `Family Members: ${appData.familyMembers.map(m => m.name).join(', ')}\n\n`;
    
    pdfContent += 'MOOD ENTRIES\n';
    pdfContent += '-'.repeat(20) + '\n';
    appData.moodEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      pdfContent += `${formatDate(entry.date)} - ${member?.name}: ${entry.emoji}\n`;
      if (entry.note) pdfContent += `  Note: ${entry.note}\n`;
      pdfContent += '\n';
    });
    
    pdfContent += '\nREFLECTION ENTRIES\n';
    pdfContent += '-'.repeat(20) + '\n';
    appData.reflectionEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      pdfContent += `${formatDate(entry.date)} - ${member?.name}\n`;
      pdfContent += `Q: ${entry.prompt}\n`;
      pdfContent += `A: ${entry.response}\n\n`;
    });
    
    pdfContent += '\nGRATITUDE ENTRIES\n';
    pdfContent += '-'.repeat(20) + '\n';
    appData.gratitudeEntries.forEach(entry => {
      const member = appData.familyMembers.find(m => m.id === entry.memberId);
      pdfContent += `${formatDate(entry.date)} - ${member?.name}\n`;
      pdfContent += `${entry.text}\n\n`;
    });
    
    return pdfContent;
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    try {
      if (exportFormat === 'csv') {
        const csvContent = generateCSV();
        downloadFile(csvContent, `family-flow-${timestamp}.csv`, 'text/csv');
      } else if (exportFormat === 'json') {
        const jsonContent = generateJSON();
        downloadFile(jsonContent, `family-flow-${timestamp}.json`, 'application/json');
      } else if (exportFormat === 'pdf') {
        const pdfContent = generatePDF();
        downloadFile(pdfContent, `family-flow-${timestamp}.txt`, 'text/plain');
      }
      
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        setExportFormat(null);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getTotalEntries = () => {
    return appData.moodEntries.length + appData.reflectionEntries.length + appData.gratitudeEntries.length;
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

  const hasData = () => {
    return getTotalEntries() > 0 || appData.familyMembers.length > 3; // More than default 3 members
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
          <h1 className="font-title text-4xl mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Memory Capsule
          </h1>
          <p className="text-gray-600 text-xl">Export your family's digital memories</p>
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-3 h-auto"
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
                onClick={() => setExportFormat('csv')}
                className="w-full p-6 rounded-2xl border-3 border-gray-200 hover:border-indigo-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="font-medium text-lg">CSV Spreadsheet</div>
                    <div className="text-base text-gray-600">Open in Excel, Google Sheets, etc.</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setExportFormat('json')}
                className="w-full p-6 rounded-2xl border-3 border-gray-200 hover:border-indigo-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-4">
                  <Database className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-lg">JSON Data</div>
                    <div className="text-base text-gray-600">Raw data format for developers</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setExportFormat('pdf')}
                className="w-full p-6 rounded-2xl border-3 border-gray-200 hover:border-indigo-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="font-medium text-lg">Text Report</div>
                    <div className="text-base text-gray-600">Readable summary document</div>
                  </div>
                </div>
              </button>
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
              <h3 className="text-2xl">Export as {exportFormat.toUpperCase()}</h3>
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
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl py-4 h-auto"
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
            className="w-full text-lg py-4 h-auto"
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
        {hasData() && (
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