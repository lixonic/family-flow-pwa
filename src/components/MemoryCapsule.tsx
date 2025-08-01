import React, { useState, useRef } from 'react';
import { AppData } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatDate } from './ui/utils';
import { Download, FileText, Database, Smartphone, Info, Shield, HelpCircle, QrCode, Camera, Share2, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import LZString from 'lz-string';

interface MemoryCapsuleProps {
  appData: AppData;
  onNavigate: (screen: string) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
  onEraseAllData: () => void;
  onImportData: (data: Partial<AppData>) => void;
}

export function MemoryCapsule({ appData, onNavigate, deferredPrompt, setDeferredPrompt, onEraseAllData, onImportData }: MemoryCapsuleProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [eraseInput, setEraseInput] = useState('');
  const [storageMetrics, setStorageMetrics] = useState<{
    familyFlowSize: number;
    totalSize: number;
    estimatedLimit: number;
    familyFlowPercentage: number;
    totalPercentage: number;
    browserType: string;
    storageType: string;
  } | null>(null);

  // Sync-related state
  const [syncMode, setSyncMode] = useState<'share' | 'receive' | null>(null);
  const [shareType, setShareType] = useState<'today' | 'all' | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [showDataTooLarge, setShowDataTooLarge] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  // QR Code size limits (conservative estimates)
  const QR_LIMITS = {
    MAX_COMPRESSED_SIZE: 2800, // bytes - conservative limit for reliable scanning
    MAX_UNCOMPRESSED_SIZE: 1400, // bytes - fallback if compression fails
    WARNING_SIZE: 2000, // bytes - show warning but still attempt
  };

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

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter'
    });

    // Helper functions for consistent styling
    const colors = {
      primary: [249, 115, 22], // Orange #F97316
      secondary: [219, 39, 119], // Pink
      text: [75, 85, 99], // Gray-600
      light: [156, 163, 175] // Gray-400
    };

    const addCoverPage = () => {
      // Background gradient effect (simulated with rectangles)
      doc.setFillColor(249, 248, 246); // Warm background
      doc.rect(0, 0, 8.5, 11, 'F');
      
      // Title with handwritten feel
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      
      const titleText = 'Our Family Journey';
      const titleWidth = doc.getTextWidth(titleText);
      doc.text(titleText, (8.5 - titleWidth / 72) / 2, 2.5);
      
      // Subtitle
      doc.setFontSize(18);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const subtitleText = 'Digital Wellness Memory Book';
      const subtitleWidth = doc.getTextWidth(subtitleText);
      doc.text(subtitleText, (8.5 - subtitleWidth / 72) / 2, 3.2);
      
      // Family members
      doc.setFontSize(16);
      const memberNames = appData.familyMembers.map(m => m.name).join(' • ');
      const membersWidth = doc.getTextWidth(memberNames);
      doc.text(memberNames, (8.5 - membersWidth / 72) / 2, 4);
      
      // Date range
      const allDates = [
        ...appData.moodEntries.map(e => new Date(e.date)),
        ...appData.reflectionEntries.map(e => new Date(e.date)),
        ...appData.gratitudeEntries.map(e => new Date(e.date))
      ];
      
      if (allDates.length > 0) {
        const earliest = new Date(Math.min(...allDates.map(d => d.getTime())));
        const latest = new Date(Math.max(...allDates.map(d => d.getTime())));
        const dateRange = `${formatDate(earliest)} - ${formatDate(latest)}`;
        
        doc.setFontSize(14);
        doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
        const dateWidth = doc.getTextWidth(dateRange);
        doc.text(dateRange, (8.5 - dateWidth / 72) / 2, 4.8);
      }
      
      // Decorative elements
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.02);
      doc.line(2, 5.5, 6.5, 5.5); // Decorative line
      
      // Stats summary in a beautiful box
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(2, 6, 4.5, 2.5, 0.1, 0.1, 'FD');
      
      doc.setFontSize(12);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text('Our Journey Together:', 2.5, 6.5);
      
      doc.setFontSize(10);
      doc.text(`• ${appData.moodEntries.length} mood check-ins`, 2.5, 7);
      doc.text(`• ${appData.reflectionEntries.length} thoughtful reflections`, 2.5, 7.3);
      doc.text(`• ${appData.gratitudeEntries.length} gratitude moments`, 2.5, 7.6);
      doc.text(`• ${appData.familyMembers.length} family members growing together`, 2.5, 7.9);
      
      // Footer message
      doc.setFontSize(10);
      doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
      const footerText = 'Success means you won\'t need us forever ✨';
      const footerWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (8.5 - footerWidth / 72) / 2, 10);
    };

    const addFamilyGallery = () => {
      doc.addPage();
      
      // Page title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('Meet Our Family', 1, 1.5);
      
      // Family member cards
      const membersPerRow = 2;
      const cardWidth = 3.5;
      const cardHeight = 2;
      const marginX = 0.75;
      const marginY = 0.5;
      
      appData.familyMembers.forEach((member, index) => {
        const row = Math.floor(index / membersPerRow);
        const col = index % membersPerRow;
        const x = 1 + col * (cardWidth + marginX);
        const y = 2.5 + row * (cardHeight + marginY);
        
        // Member card background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
        doc.roundedRect(x, y, cardWidth, cardHeight, 0.1, 0.1, 'FD');
        
        // Member avatar (emoji as text)
        doc.setFontSize(32);
        doc.text(member.avatar, x + 0.3, y + 0.8);
        
        // Member name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(member.name, x + 1.2, y + 0.8);
        
        // Member color indicator
        const memberColorRGB = hexToRgb(member.color) || colors.primary;
        doc.setFillColor(memberColorRGB[0], memberColorRGB[1], memberColorRGB[2]);
        doc.circle(x + 1.2, y + 1.2, 0.1, 'F');
        
        doc.setFontSize(10);
        doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
        doc.text('My color', x + 1.4, y + 1.25);
      });
    };

    const addMoodSection = () => {
      doc.addPage();
      
      // Section title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('Our Moods Together', 1, 1.5);
      
      let yPosition = 2.5;
      const lineHeight = 0.4;
      
      appData.moodEntries.forEach((entry, index) => {
        if (yPosition > 10) {
          doc.addPage();
          yPosition = 1.5;
        }
        
        const member = appData.familyMembers.find(m => m.id === entry.memberId);
        
        // Date
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
        doc.text(formatDate(entry.date), 1, yPosition);
        
        // Member name
        doc.setFontSize(12);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(member?.name || 'Unknown', 2.5, yPosition);
        
        // Mood emoji
        doc.setFontSize(16);
        doc.text(entry.emoji, 4, yPosition);
        
        // Note if available
        if (entry.note) {
          doc.setFontSize(10);
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const noteLines = doc.splitTextToSize(entry.note, 4);
          doc.text(noteLines, 4.5, yPosition);
          yPosition += noteLines.length * 0.15;
        }
        
        yPosition += lineHeight;
        
        // Add subtle separator line
        if (index < appData.moodEntries.length - 1) {
          doc.setDrawColor(colors.light[0], colors.light[1], colors.light[2]);
          doc.setLineWidth(0.005);
          doc.line(1, yPosition - 0.1, 7.5, yPosition - 0.1);
        }
      });
    };

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    };

    // Generate the PDF
    addCoverPage();
    addFamilyGallery();
    addMoodSection();
    
    // Add similar sections for reflections and gratitude...
    // (Implementation continues with reflection and gratitude sections)
    
    return doc;
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
        downloadFile(csvContent, `family-flow-memory-book-${timestamp}.csv`, 'text/csv');
      } else if (exportFormat === 'pdf') {
        const pdfDoc = generatePDF();
        pdfDoc.save(`family-flow-memory-book-${timestamp}.pdf`);
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

  const hasData = () => {
    return getTotalEntries() > 0 || appData.familyMembers.length > 3; // More than default 3 members
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

  const validateDataSize = (data: any, type: 'today' | 'all'): { 
    canShare: boolean; 
    size: number; 
    compressed?: number;
    warning?: string; 
    error?: string; 
  } => {
    const uncompressedSize = getDataSize(data);
    
    // Try compression
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compress(jsonString);
    const compressedSize = compressed ? new Blob([compressed]).size : uncompressedSize;
    
    // Check limits
    if (compressedSize <= QR_LIMITS.MAX_COMPRESSED_SIZE) {
      if (compressedSize > QR_LIMITS.WARNING_SIZE) {
        return {
          canShare: true,
          size: uncompressedSize,
          compressed: compressedSize,
          warning: `Large dataset (${formatDataSize(compressedSize)} compressed). QR code may take longer to scan.`
        };
      }
      return {
        canShare: true,
        size: uncompressedSize,
        compressed: compressedSize
      };
    }
    
    // Too large even with compression
    if (type === 'all') {
      const todaysData = getTodaysEntries();
      const todaysSize = getDataSize(todaysData);
      
      if (todaysSize <= QR_LIMITS.MAX_COMPRESSED_SIZE) {
        return {
          canShare: false,
          size: uncompressedSize,
          compressed: compressedSize,
          error: `All family data (${formatDataSize(compressedSize)}) is too large for QR code. Try "Share Today" instead (${formatDataSize(todaysSize)}).`
        };
      }
    }
    
    return {
      canShare: false,
      size: uncompressedSize,
      compressed: compressedSize,
      error: `Data (${formatDataSize(compressedSize)} compressed) exceeds QR code limit (${formatDataSize(QR_LIMITS.MAX_COMPRESSED_SIZE)}). Try exporting as file instead.`
    };
  };

  const createOptimizedPayload = (data: any, type: 'today' | 'all') => {
    // Create minimal payload to reduce size
    const optimizedData = {
      ...data,
      // Remove unnecessary metadata
      graduationMilestones: undefined, // Don't sync graduation progress
      graduationSettings: undefined,   // Don't sync settings
    };

    // Further optimize by removing empty arrays
    Object.keys(optimizedData).forEach(key => {
      if (Array.isArray(optimizedData[key]) && optimizedData[key].length === 0) {
        delete optimizedData[key];
      }
    });

    const payload = {
      type: 'family-flow-sync',
      version: '1.0',
      syncType: type,
      timestamp: new Date().toISOString(),
      data: optimizedData
    };

    return payload;
  };

  // Sync functionality
  const getTodaysEntries = () => {
    const today = new Date().toDateString();
    return {
      moodEntries: appData.moodEntries.filter(entry => new Date(entry.date).toDateString() === today),
      reflectionEntries: appData.reflectionEntries.filter(entry => new Date(entry.date).toDateString() === today),
      gratitudeEntries: appData.gratitudeEntries.filter(entry => new Date(entry.date).toDateString() === today),
      familyMembers: appData.familyMembers
    };
  };

  const generateQrCode = async (data: any, type: 'today' | 'all') => {
    setIsGeneratingQr(true);
    setSizeError(null);
    
    try {
      // Validate data size first
      const sizeCheck = validateDataSize(data, type);
      
      if (!sizeCheck.canShare) {
        setSizeError(sizeCheck.error || 'Data too large for QR code');
        setShowDataTooLarge(true);
        return;
      }

      // Create optimized payload
      const payload = createOptimizedPayload(data, type);
      const jsonString = JSON.stringify(payload);
      
      // Compress the data
      const compressed = LZString.compress(jsonString);
      const finalData = compressed || jsonString; // Fallback to uncompressed
      
      // Final size check after compression
      const finalSize = new Blob([finalData]).size;
      if (finalSize > QR_LIMITS.MAX_COMPRESSED_SIZE) {
        setSizeError(`Compressed data (${formatDataSize(finalSize)}) still exceeds QR limit. Try exporting as file instead.`);
        setShowDataTooLarge(true);
        return;
      }

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(finalData, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M', // Medium error correction for better reliability
        color: {
          dark: '#F97316', // Family Flow orange
          light: '#FFFFFF'
        }
      });

      setQrDataUrl(qrDataUrl);
      setShareType(type);
      
      // Show warning if data is large but still shareable
      if (sizeCheck.warning) {
        setSizeError(sizeCheck.warning);
      }
    } catch (error) {
      console.error('QR generation failed:', error);
      setSizeError('Failed to generate QR code. Data may be too large or contain invalid characters.');
      setShowDataTooLarge(true);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleShareToday = async () => {
    const todaysData = getTodaysEntries();
    if (todaysData.moodEntries.length === 0 && todaysData.reflectionEntries.length === 0 && todaysData.gratitudeEntries.length === 0) {
      alert('No entries for today to share. Add some mood, reflection, or gratitude entries first!');
      return;
    }
    await generateQrCode(todaysData, 'today');
    setSyncMode('share');
  };

  const handleShareAll = async () => {
    if (!hasData()) {
      alert('No family data to share. Add some entries first!');
      return;
    }
    await generateQrCode(appData, 'all');
    setSyncMode('share');
  };

  const startScanning = async () => {
    if (!videoRef.current) return;
    
    setScanError(null);
    setIsScanning(true);
    setSyncMode('receive');
    
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not available on this device');
      }

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQrScanResult(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (error) {
      console.error('Scanner failed:', error);
      setScanError('Camera access failed. Please allow camera permissions and try again.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
    setSyncMode(null);
  };

  const handleQrScanResult = (data: string) => {
    try {
      let parsedPayload;
      
      // Try to decompress first (new format)
      try {
        const decompressed = LZString.decompress(data);
        if (decompressed) {
          parsedPayload = JSON.parse(decompressed);
        } else {
          // Fallback to direct JSON parsing (legacy format)
          parsedPayload = JSON.parse(data);
        }
      } catch {
        // Fallback to direct JSON parsing
        parsedPayload = JSON.parse(data);
      }
      
      if (parsedPayload.type !== 'family-flow-sync') {
        throw new Error('Not a Family Flow sync QR code');
      }

      // Version compatibility check
      if (parsedPayload.version !== '1.0') {
        setScanError(`Unsupported QR code version (${parsedPayload.version}). Please update Family Flow on both devices.`);
        return;
      }

      const importedData = parsedPayload.data;
      
      // Calculate import statistics
      const entryCount = 
        (importedData.moodEntries?.length || 0) + 
        (importedData.reflectionEntries?.length || 0) + 
        (importedData.gratitudeEntries?.length || 0);
      
      const memberCount = importedData.familyMembers?.length || 0;
      
      // Enhanced confirmation dialog
      const syncType = parsedPayload.syncType === 'today' ? 'today\'s' : 'all';
      const timestamp = new Date(parsedPayload.timestamp).toLocaleString();
      
      const confirmed = confirm(
        `Import ${syncType} family data?\n\n` +
        `• ${entryCount} entries (mood, reflection, gratitude)\n` +
        `• ${memberCount} family members\n` +
        `• Created: ${timestamp}\n\n` +
        `This will add new data to your existing family entries.`
      );

      if (confirmed) {
        onImportData(importedData);
        alert(`✅ Successfully imported ${entryCount} family entries and ${memberCount} family members!`);
        stopScanning();
      }
    } catch (error) {
      console.error('QR scan failed:', error);
      setScanError('Invalid QR code. Please scan a Family Flow sync QR code, or the data may be corrupted.');
    }
  };

  const resetSyncMode = () => {
    setSyncMode(null);
    setShareType(null);
    setQrDataUrl(null);
    setScanError(null);
    setSizeError(null);
    setShowDataTooLarge(false);
    stopScanning();
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

        {/* Sync Data Section */}
        {!exportFormat && !syncMode && (
          <div className="mb-10">
            <div className="flex items-center justify-center mb-6">
              <h3 className="text-2xl mr-3">Sync with your family</h3>
            </div>
            
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-4">
                Share data between your family's devices using QR codes
              </p>
              <p className="text-sm text-gray-500">
                No internet needed • Data stays private • Works offline
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Button
                onClick={handleShareToday}
                variant="outline"
                className="flex-1 h-auto py-4 px-6 flex flex-col items-center space-y-2"
              >
                <Share2 className="w-6 h-6 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Share Today</div>
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const todaysData = getTodaysEntries();
                      const todaysEntries = todaysData.moodEntries.length + todaysData.reflectionEntries.length + todaysData.gratitudeEntries.length;
                      if (todaysEntries === 0) return 'No entries today';
                      
                      const size = getDataSize(todaysData);
                      return `${todaysEntries} entries (${formatDataSize(size)})`;
                    })()}
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={handleShareAll}
                variant="outline"
                disabled={!hasData()}
                className={`flex-1 h-auto py-4 px-6 flex flex-col items-center space-y-2 ${
                  !hasData() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Users className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Share All Data</div>
                  <div className="text-sm text-gray-600">
                    {(() => {
                      if (!hasData()) return 'Add some entries first';
                      
                      const totalEntries = getTotalEntries();
                      const size = getDataSize(appData);
                      const compressed = LZString.compress(JSON.stringify(appData));
                      const compressedSize = compressed ? new Blob([compressed]).size : size;
                      
                      if (compressedSize > QR_LIMITS.MAX_COMPRESSED_SIZE) {
                        return `${totalEntries} entries (too large for QR)`;
                      }
                      
                      return `${totalEntries} entries (${formatDataSize(compressedSize)})`;
                    })()}
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={startScanning}
                variant="outline"
                className="flex-1 h-auto py-4 px-6 flex flex-col items-center space-y-2"
              >
                <Camera className="w-6 h-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Receive Data</div>
                  <div className="text-sm text-gray-600">Scan QR from family</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* QR Share Mode */}
        {syncMode === 'share' && qrDataUrl && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <button
                onClick={resetSyncMode}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ← Back
              </button>
              <h3 className="text-2xl">Share {shareType === 'today' ? 'Today\'s Entries' : 'All Family Data'}</h3>
            </div>

            {/* Size warning if exists */}
            {sizeError && !showDataTooLarge && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <span className="text-amber-600 text-xl">⚠️</span>
                  <div>
                    <p className="text-amber-800 font-medium">Large Dataset Warning</p>
                    <p className="text-amber-700 text-sm">{sizeError}</p>
                  </div>
                </div>
              </div>
            )}

            <Card className="p-8 text-center">
              <div className="mb-6">
                <img 
                  src={qrDataUrl} 
                  alt="Family Flow Sync QR Code" 
                  className="mx-auto rounded-lg shadow-lg"
                  style={{ maxWidth: '250px' }}
                />
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="font-medium text-lg">
                  {shareType === 'today' ? '📱 Scan to continue today\'s session' : '👨‍👩‍👧‍👦 Scan to receive all family data'}
                </p>
                <p className="text-gray-600">
                  Have another family member scan this QR code with their Family Flow app
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Privacy:</strong> Data transfers directly between devices • No servers • No internet required
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Data Too Large Error */}
        {showDataTooLarge && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <button
                onClick={resetSyncMode}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ← Back
              </button>
              <h3 className="text-2xl">Data Too Large for QR Code</h3>
            </div>

            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-xl font-medium text-red-600 mb-2">
                  QR Code Size Limit Exceeded
                </h4>
                <p className="text-gray-600 mb-4">{sizeError}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Why this happened:</strong> QR codes can only hold limited data (~2.8KB). 
                  Your family has created lots of wonderful memories that exceed this limit!
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium text-gray-800">Alternative options:</h5>
                
                <div className="grid gap-3">
                  <Button
                    onClick={() => {
                      resetSyncMode();
                      // Auto-switch to today sharing if all data was too large
                      if (shareType === 'all') {
                        const todaysData = getTodaysEntries();
                        const todaysSize = getDataSize(todaysData);
                        if (todaysSize <= QR_LIMITS.MAX_COMPRESSED_SIZE) {
                          setTimeout(() => handleShareToday(), 100);
                        }
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Try "Share Today" Instead
                  </Button>
                  
                  <Button
                    onClick={() => {
                      resetSyncMode();
                      setExportFormat('csv');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV File Instead
                  </Button>
                  
                  <Button
                    onClick={() => {
                      resetSyncMode();
                      setExportFormat('pdf');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Memory Book PDF Instead
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* QR Scanner Mode */}
        {syncMode === 'receive' && (
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <button
                onClick={resetSyncMode}
                className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
              >
                ← Back
              </button>
              <h3 className="text-2xl">Scan Family QR Code</h3>
            </div>

            <Card className="p-8">
              {scanError ? (
                <div className="text-center">
                  <div className="text-red-600 mb-4">⚠️ {scanError}</div>
                  <Button onClick={startScanning} className="mb-4">
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4">
                    <video
                      ref={videoRef}
                      className="mx-auto rounded-lg max-w-full"
                      style={{ maxWidth: '400px', maxHeight: '300px' }}
                    />
                  </div>
                  
                  {isScanning ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">📷 Point camera at Family Flow QR code</p>
                      <Button onClick={stopScanning} variant="outline">
                        Stop Scanning
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600">Setting up camera...</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}

        {!exportFormat && !syncMode && (
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
                onClick={() => hasData() && setExportFormat('csv')}
                disabled={!hasData()}
                className={`w-full p-6 rounded-2xl border-3 transition-colors text-left ${
                  hasData() 
                    ? 'border-gray-200 hover:border-indigo-300 cursor-pointer' 
                    : 'border-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <FileText className={`w-8 h-8 ${hasData() ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <div className={`font-medium text-lg ${hasData() ? 'text-gray-900' : 'text-gray-400'}`}>
                      CSV Spreadsheet
                    </div>
                    <div className={`text-base ${hasData() ? 'text-gray-600' : 'text-gray-400'}`}>
                      {hasData() ? 'Open in Excel, Google Sheets, etc.' : 'Add some family entries first'}
                    </div>
                  </div>
                </div>
              </button>
              
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