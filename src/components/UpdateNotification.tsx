import React from 'react';
import { Download, X } from 'lucide-react';

interface UpdateNotificationProps {
  isVisible: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
  isUpdating?: boolean;
}

export function UpdateNotification({ 
  isVisible, 
  onUpdate, 
  onDismiss, 
  isUpdating = false 
}: UpdateNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white border-2 border-orange-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <Download className="w-4 h-4 text-orange-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              🌱 Family Flow has a small update ready
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Updates usually add helpful features while keeping your family memories safe
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onUpdate}
                disabled={isUpdating}
                className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update in 10 seconds'}
              </button>
              
              <button
                onClick={onDismiss}
                disabled={isUpdating}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Maybe later
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              • All your entries stay exactly as they are
            </p>
          </div>
          
          <button
            onClick={onDismiss}
            disabled={isUpdating}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}