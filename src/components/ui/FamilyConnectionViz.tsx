import React, { useEffect, useState, useMemo } from 'react';
import { FamilyMember, MoodEntry } from '../../App';


interface FamilyConnectionVizProps {
  familyMembers: FamilyMember[];
  moodEntries: MoodEntry[];
  className?: string;
}

export const FamilyConnectionViz: React.FC<FamilyConnectionVizProps> = ({
  familyMembers,
  moodEntries,
  className = ''
}) => {
  const [animatedLines, setAnimatedLines] = useState<Array<{ id: string; fromX: number; fromY: number; toX: number; toY: number; delay: number }>>([]);


  // Create nodes positioned in a circle
  const nodes = useMemo(() => {
    if (familyMembers.length === 0) return [];

    const centerX = 150;
    const centerY = 100;
    const radius = 60;
    const angleStep = (2 * Math.PI) / familyMembers.length;

    const today = new Date().toDateString();
    const todayEntries = moodEntries.filter(entry => 
      new Date(entry.date).toDateString() === today
    );

    return familyMembers.map((member, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const memberEntries = todayEntries.filter(entry => entry.memberId === member.id);
      
      return {
        id: member.id,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        member,
        hasEntry: memberEntries.length > 0,
        entryCount: memberEntries.length
      };
    });
  }, [familyMembers, moodEntries]);

  // Generate connection lines between members who both have entries today
  useEffect(() => {
    if (nodes.length < 2) {
      setAnimatedLines([]);
      return;
    }

    const activeNodes = nodes.filter(node => node.hasEntry);
    const lines: Array<{ id: string; fromX: number; fromY: number; toX: number; toY: number; delay: number }> = [];

    // Create connections between all active members
    for (let i = 0; i < activeNodes.length; i++) {
      for (let j = i + 1; j < activeNodes.length; j++) {
        const from = activeNodes[i];
        const to = activeNodes[j];
        
        lines.push({
          id: `${from.id}-${to.id}`,
          fromX: from.x,
          fromY: from.y,
          toX: to.x,
          toY: to.y,
          delay: (i + j) * 200 // Stagger animations
        });
      }
    }

    setAnimatedLines(lines);
  }, [nodes]);

  if (familyMembers.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full h-48 ${className}`}>
      <svg 
        width="300" 
        height="200" 
        viewBox="0 0 300 200" 
        className="w-full h-full"
      >
        {/* Connection lines */}
        {animatedLines.map((line) => (
          <g key={line.id}>
            {/* Glowing background line */}
            <line
              x1={line.fromX}
              y1={line.fromY}
              x2={line.toX}
              y2={line.toY}
              stroke="rgba(249, 115, 22, 0.2)"
              strokeWidth="6"
              className="animate-connection-line"
              style={{
                animationDelay: `${line.delay}ms`,
                strokeDasharray: "5,3",
                opacity: 0
              }}
            />
            {/* Main connection line */}
            <line
              x1={line.fromX}
              y1={line.fromY}
              x2={line.toX}
              y2={line.toY}
              stroke="rgba(249, 115, 22, 0.6)"
              strokeWidth="2"
              className="animate-connection-line"
              style={{
                animationDelay: `${line.delay + 100}ms`,
                strokeDasharray: "5,3",
                opacity: 0
              }}
            />
            {/* Pulse effect */}
            <circle
              cx={line.fromX + (line.toX - line.fromX) / 2}
              cy={line.fromY + (line.toY - line.fromY) / 2}
              r="3"
              fill="rgba(249, 115, 22, 0.8)"
              className="animate-glow-pulse"
              style={{
                animationDelay: `${line.delay + 200}ms`,
                opacity: 0
              }}
            />
          </g>
        ))}

        {/* Family member nodes */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Glow effect for active members */}
            {node.hasEntry && (
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill="none"
                stroke="rgba(249, 115, 22, 0.3)"
                strokeWidth="2"
                className="animate-glow-pulse"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              />
            )}
            
            {/* Main node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={node.hasEntry ? 'rgba(249, 115, 22, 0.8)' : 'rgba(156, 163, 175, 0.6)'}
              stroke={node.hasEntry ? 'rgba(249, 115, 22, 1)' : 'rgba(156, 163, 175, 0.8)'}
              strokeWidth="2"
              className={`transition-all duration-500 ${node.hasEntry ? 'animate-breathe' : ''}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            />
            
            {/* Entry count indicator */}
            {node.entryCount > 1 && (
              <circle
                cx={node.x + 12}
                cy={node.y - 12}
                r="8"
                fill="rgba(249, 115, 22, 0.9)"
                stroke="white"
                strokeWidth="2"
                className="animate-spring-in"
                style={{
                  animationDelay: `${index * 100 + 300}ms`
                }}
              />
            )}
            
            {/* Entry count text */}
            {node.entryCount > 1 && (
              <text
                x={node.x + 12}
                y={node.y - 8}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
                className="animate-spring-in"
                style={{
                  animationDelay: `${index * 100 + 300}ms`
                }}
              >
                {node.entryCount}
              </text>
            )}
            
            {/* Member name - centered on node */}
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="13"
              fill={node.hasEntry ? 'rgba(249, 115, 22, 1)' : 'rgba(55, 65, 81, 1)'}
              fontWeight="700"
              className="transition-colors duration-300"
              style={{
                textShadow: '0 2px 4px rgba(255, 255, 255, 0.95)',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.02em'
              }}
            >
              {String(node.member.name || 'Unknown').length > 8 ? `${String(node.member.name || 'Unknown').slice(0, 6)}...` : String(node.member.name || 'Unknown')}
            </text>
          </g>
        ))}
      </svg>

      {/* Connection strength indicator */}
      {animatedLines.length > 0 && (
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-xs text-neutral-600">
          <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
          <span className="font-medium">
            {animatedLines.length} family connection{animatedLines.length !== 1 ? 's' : ''} today
          </span>
        </div>
      )}
    </div>
  );
};