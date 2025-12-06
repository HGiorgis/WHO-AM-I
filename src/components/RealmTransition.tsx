// components/RealmTransition.tsx - Scroll Focus Design
import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Code, 
  Palette, 
  Gamepad2,
  CheckCircle2,
  Scan
} from 'lucide-react';

interface RealmTransitionProps {
  isActive: boolean;
  fromRealm: string;
}

export const RealmTransition: React.FC<RealmTransitionProps> = ({ isActive, fromRealm }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const realmConfig = {
    cyber: { name: 'CYBER CORE', color: 'cyan', icon: Shield },
    dev: { name: 'DEV REALM', color: 'blue', icon: Code },
    design: { name: 'DESIGN VAULT', color: 'yellow', icon: Palette },
    game: { name: 'GAME SANCTUM', color: 'green', icon: Gamepad2 }
  };

  const steps = [
    'INITIALIZING',
    'CONNECTING',
    'SYNCING',
    'VERIFYING',
    'COMPLETE'
  ];

  const currentRealm = realmConfig[fromRealm as keyof typeof realmConfig] || realmConfig.cyber;
  const IconComponent = currentRealm.icon;

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="text-center max-w-sm w-full mx-6">
        
        {/* Realm Icon */}
        <div className={`mb-8 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${currentRealm.color}-500 to-${currentRealm.color}-600 rounded-2xl shadow-lg`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>

        {/* Scroll Progress Wheel */}
        <div className="relative mb-8">
          {/* Center Focus Line */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-0.5 bg-cyan-400/50 z-10" />
          
          {/* Scanning Beam */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-cyan-400 animate-pulse z-20">
            <div className="absolute inset-0 bg-cyan-400 blur-sm" />
          </div>

          {/* Progress Wheel */}
          <div className="flex justify-center space-x-1 overflow-x-auto py-4 scrollbar-hide">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const isCompleted = index < activeIndex;
              const isUpcoming = index > activeIndex;

              return (
                <div
                  key={step}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-${currentRealm.color}-500/20 border-${currentRealm.color}-400 scale-110 shadow-lg`
                      : isCompleted
                      ? 'bg-green-500/10 border-green-400/50 scale-95'
                      : 'bg-gray-800/50 border-gray-600/30 scale-90 opacity-60'
                  }`}
                >
                  {/* Step Number */}
                  <div className={`text-xs font-mono font-bold transition-all duration-300 ${
                    isActive 
                      ? `text-${currentRealm.color}-400` 
                      : isCompleted 
                      ? 'text-green-400' 
                      : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Status Icon */}
                  <div className={`transition-all duration-300 ${
                    isActive 
                      ? `text-${currentRealm.color}-400` 
                      : isCompleted 
                      ? 'text-green-400' 
                      : 'text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isActive ? (
                      <Scan className="w-4 h-4 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-current opacity-50" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Display */}
        <div className={`text-lg font-mono font-bold mb-2 text-${currentRealm.color}-400`}>
          {steps[activeIndex]}
        </div>
            
        {/* Progress Text */}
        <div className="text-sm text-gray-400 font-light">
          {activeIndex === steps.length - 1 
            ? 'Realm Ready' 
            : `Step ${activeIndex + 1} of ${steps.length}`
          }
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-6 w-32 mx-auto bg-gray-700 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-${currentRealm.color}-400 to-${currentRealm.color}-600 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Scanning Animation */}
        <div className="mt-4 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full bg-${currentRealm.color}-400 animate-pulse`}
              style={{ 
                animationDelay: `${i * 0.2}s`,
                opacity: activeIndex === steps.length - 1 ? 0.3 : 0.8
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${currentRealm.color}-900/10 to-transparent pointer-events-none`} />
    </div>
  );
};