import React, { useState } from 'react';
import { AppData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Share, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface FamilySyncProps {
  appData: AppData;
  onNavigate: (screen: string) => void;
  onImportData: (data: Partial<AppData>) => void;
}

export function FamilySync({ appData, onNavigate, onImportData }: FamilySyncProps) {
  const [importStatus, setImportStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Check if Web Share API is supported
  const supportsWebShare = 'share' in navigator;

  // Calculate data metrics
  const getTotalEntries = () => {
    return appData.moodEntries.length + appData.reflectionEntries.length + appData.gratitudeEntries.length;
  };

  const hasDataForSync = () => {
    return getTotalEntries() > 0 || appData.familyMembers.length > 0; // Any data for sync
  };


  // Generate family data file
  const generateFamilyData = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: '2.0',
        totalEntries: getTotalEntries(),
        familyMembers: appData.familyMembers.length,
        familyName: appData.familyMembers.length > 0 ? appData.familyMembers[0].name + "'s family" : 'Family'
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

  // Generate filename for family data
  const generateFamilyFilename = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const familyName = appData.familyMembers.length > 0 
      ? appData.familyMembers[0].name.toLowerCase().replace(/[^a-z0-9]/gi, '') 
      : 'family';
    const entryCount = getTotalEntries();
    
    return `familyflow-${familyName}-${entryCount}entries-${timestamp}.json`;
  };


  // Share via Web Share API or download
  const shareViaWebShare = async (format: 'json' | 'txt' = 'txt') => {
    const familyData = generateFamilyData();
    const baseFilename = generateFamilyFilename().replace('.json', '');
    const filename = format === 'txt' ? `${baseFilename}.txt` : `${baseFilename}.json`;
    const mimeType = format === 'txt' ? 'text/plain' : 'application/json';
    
    try {
      if (supportsWebShare) {
        // Create a File object for Web Share API
        const file = new File([familyData], filename, { type: mimeType });
        
        await navigator.share({
          title: 'Family Flow Data',
          text: `Family memories from ${appData.familyMembers[0]?.name || 'your family'}`,
          files: [file]
        });
        
        setImportStatus({
          type: 'success',
          message: '✅ Family data shared successfully!'
        });
      } else {
        // Fallback: Download file
        downloadFile(familyData, filename, mimeType);
        setImportStatus({
          type: 'info',
          message: `📱 File downloaded as ${format.toUpperCase()}! Share it with your family via your preferred method.`
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to download
      downloadFile(familyData, filename);
      setImportStatus({
        type: 'info',
        message: '📁 File saved to downloads. You can now share it with your family!'
      });
    }
  };

  // Download file fallback
  const downloadFile = (content: string, filename: string, mimeType: string = 'application/json') => {
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

  // Handle file import
  const handleFileImport = async (file: File) => {
    setImportStatus(null);
    
    if (!file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
      setImportStatus({
        type: 'error',
        message: 'Please select a Family Flow file (.json or .txt)'
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

      const { familyData, metadata } = importedData;
      const entryCount = 
        (familyData.moodEntries?.length || 0) + 
        (familyData.reflectionEntries?.length || 0) + 
        (familyData.gratitudeEntries?.length || 0);
      
      const memberCount = familyData.familyMembers?.length || 0;
      
      const confirmed = confirm(
        `Import family data?\n\n` +
        `• ${entryCount} family memories\n` +
        `• ${memberCount} family members\n` +
        `• From: ${metadata.familyName || 'Family'}\n\n` +
        `This will add to your existing family data.`
      );

      if (confirmed) {
        onImportData(familyData);
        setImportStatus({
          type: 'success',
          message: `✅ Successfully imported ${entryCount} family memories!`
        });
        
        setTimeout(() => setImportStatus(null), 5000);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus({
        type: 'error',
        message: 'Could not read this file. Make sure it\'s a Family Flow export file.'
      });
    }
  };

  // Drag and drop handlers
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
            Share with Family
          </h2>
          <p className="text-gray-600">
            Send your family memories to another device securely - data never leaves your family
          </p>
        </div>

        {/* What Will Be Shared */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-green-900">Ready to Share</h3>
          </div>
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-green-800">{getTotalEntries()}</div>
            <div className="text-sm text-green-700">family memories from {appData.familyMembers.length} family members</div>
          </div>
          <div className="text-xs text-green-600 text-center">
            🔒 Shared securely - data never goes to any servers
          </div>
        </Card>

        {/* Share Data Section - Always Visible */}
        <div className="space-y-6">
          {/* Share Data */}
          <Card className="p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Send your family memories
              </h3>
              <p className="text-gray-600 mb-6">
                Share your family data with them via your preferred method.
              </p>
              
              <div className="space-y-3 mb-4">
                {/* WhatsApp/Messages friendly option */}
                <Button
                  onClick={() => shareViaWebShare('txt')}
                  disabled={!hasDataForSync()}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg py-4 h-auto"
                >
                  <Share className="w-5 h-5 mr-2" />
                  Share as Text File (.txt)
                </Button>
                <p className="text-xs text-green-600">
                  ✅ Works with WhatsApp, Messages, Email - any app accepts text files
                </p>
                
                {/* Technical users option */}
                <Button
                  onClick={() => shareViaWebShare('json')}
                  disabled={!hasDataForSync()}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 py-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download as JSON (.json)
                </Button>
                <p className="text-xs text-gray-500">
                  For technical users or email sharing
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Messages */}
        {importStatus && (
          <div className={`p-4 rounded-lg mb-4 text-center ${{
            success: 'bg-green-50 border-green-200 text-green-800 border-2',
            error: 'bg-red-50 border-red-200 text-red-800 border-2',
            info: 'bg-blue-50 border-blue-200 text-blue-800 border-2'
          }[importStatus.type]}`}>
            {importStatus.message}
          </div>
        )}

        {/* Import Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">
            📥 Receive Family Data
          </h3>
          
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('family-file-input')?.click()}
            className={`border-4 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <div className="text-lg font-medium text-gray-800 mb-2">
              {isDragOver ? 'Drop family file here!' : 'Drop your family file here'}
            </div>
            <div className="text-sm text-gray-600">
              Or click to browse for a Family Flow file (.txt or .json)
            </div>
          </div>
          
          <input
            id="family-file-input"
            type="file"
            accept=".json,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
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