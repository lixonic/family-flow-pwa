import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Heart, Shield, Users } from 'lucide-react';
import familyImage from 'figma:asset/0bedd3acbca9325a13b7603663c4252390b47985.png';

interface AboutPageProps {
  onNavigate: (screen: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen px-6 py-8 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('memory')}
            className="text-gray-500 hover:text-gray-700 mr-4 text-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Family Flow
          </h1>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <img 
            src={familyImage} 
            alt="Family using technology together"
            className="w-full rounded-2xl shadow-lg"
          />
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
          <h3 className="text-2xl mb-6">Our Values</h3>
          <div className="space-y-4">
            <Card className="p-4 flex items-start space-x-4">
              <Shield className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-medium mb-2">Privacy First</h4>
                <p className="text-gray-600">No accounts, no cloud storage, no tracking. Your family's data stays with your family.</p>
              </div>
            </Card>
            
            <Card className="p-4 flex items-start space-x-4">
              <Heart className="w-8 h-8 text-pink-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-medium mb-2">Connection</h4>
                <p className="text-gray-600">A gentle two-minute ritual that brings families closer together.</p>
              </div>
            </Card>
            
            <Card className="p-4 flex items-start space-x-4">
              <Users className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-medium mb-2">Simplicity</h4>
                <p className="text-gray-600">Stripped of every unnecessary feature, distilled down to what matters most.</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Creator Story */}
        <Card className="p-6 mb-8">
          <h3 className="text-2xl mb-6">Meet the Creator</h3>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-gray-900">Helen Francis</strong> discovered her calling during a final-year BBA project analyzing digital wellness gaps in Indian households. Armed with both business acuity and a diploma in General Nursing, she recognized that families needed trust-first solutions, not surveillance-heavy apps.
            </p>
            <p>
              Helen spent one focused weekend coding a privacy-absolute PWA that feels more like a shared journal than software. Her approach strips away every unnecessary feature—no accounts, no cloud storage, no tracking—distilling connection down to a gentle two-minute ritual.
            </p>
            <p>
              Today, she shapes Family Flow as proof that meaningful technology can honor privacy while rebuilding the authentic conversations that screens often fragment.
            </p>
          </div>
        </Card>

        {/* Technical Details */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="text-2xl mb-4">How It Works</h3>
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