import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Heart, Shield, Users } from 'lucide-react';
// import familyImage from 'figma:asset/0bedd3acbca9325a13b7603663c4252390b47985.png';

interface AboutPageProps {
  onNavigate: (screen: string) => void;
}


export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen safe-area-content">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('memory')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-title text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Family Flow
          </h1>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl shadow-lg overflow-hidden">
            <img 
              src="/images/app-hero.png" 
              alt="Family using technology together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Creating meaningful technology that honors privacy while rebuilding the authentic conversations that screens often fragment.
            </p>
          </div>
        </Card>

        {/* Core Values */}
        <div className="mb-8">
          <h3 className="text-2xl mb-6 text-center">Our Values</h3>
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Privacy First</h4>
              <p className="text-gray-600">No accounts, no cloud storage, no tracking. Your family's data stays with your family.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Heart className="w-8 h-8 text-pink-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Connection</h4>
              <p className="text-gray-600">A gentle two-minute ritual that brings families closer together.</p>
            </Card>
            
            <Card className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">Simplicity</h4>
              <p className="text-gray-600">Stripped of every unnecessary feature, distilled down to what matters most.</p>
            </Card>
          </div>
        </div>

        {/* Creator Story */}
        <Card className="p-6 mb-8">
          <h3 className="text-2xl mb-6 text-center">Meet the Creator</h3>
          <div className="text-center text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Helen Francis</strong> created Family Flow during her final-year BBA project, combining business insight with her nursing background. She built this privacy-first app in one focused weekend, proving that meaningful technology can honor family trust while rebuilding authentic conversations that screens often fragment.
            </p>
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="text-2xl mb-4 text-center">How It Works</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>100% offline after first load</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>All data stored locally on your device</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>Installs like a native app</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span>No servers, no accounts, no tracking</span>
            </div>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-center text-gray-500 mb-8">
          <p className="text-lg">Family Flow v1.0</p>
          <p>Built with ❤️ for families everywhere</p>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => onNavigate('memory')}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl py-4 h-auto"
        >
          Back to Export
        </Button>
      </div>
    </div>
  );
}