import React from 'react';
import familyImage from 'figma:asset/0bedd3acbca9325a13b7603663c4252390b47985.png';

export function LoaderScreen() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${familyImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Warm overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/70 via-pink-200/70 to-red-200/70"></div>
      
      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-medium mb-4 text-gray-800">
            FAMILY FLOW
          </h1>
          <p className="text-xl text-gray-700 max-w-md mx-auto leading-relaxed">
            A gentle space for family connection and digital wellness
          </p>
        </div>
        
        {/* Loading animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="mt-6 text-gray-600 text-lg">Privacy-first • Offline-ready • No accounts needed</p>
      </div>
    </div>
  );
}