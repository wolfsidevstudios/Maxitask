import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, User, Sparkles, Check, LogIn, FastForward } from 'lucide-react';
import { VisualTheme, Wallpaper } from '../types';
import { VISUAL_THEMES, WALLPAPERS } from '../constants';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

interface OnboardingProps {
  onComplete: (name: string, location: string, theme: VisualTheme, wallpaper: Wallpaper) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Name, 2: Location, 3: Style
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>(VISUAL_THEMES[4]); // Default Liquid
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper>(WALLPAPERS[10]); // Default Crystal
  
  // Animation state
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 3) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete(name, location, selectedTheme, selectedWallpaper);
      }, 800);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSkipAll = () => {
    setIsExiting(true);
    setTimeout(() => {
        // Use defaults
        onComplete(name || 'Guest', location || 'Unknown', selectedTheme, selectedWallpaper);
    }, 800);
  };

  const handleGoogleLogin = async () => {
      try {
          setIsLoading(true);
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          if (user.displayName) {
              setName(user.displayName);
              // Skip name step, go to location
              setStep(2);
          } else {
              setStep(1);
          }
      } catch (error) {
          console.error("Login failed", error);
      } finally {
          setIsLoading(false);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 1 && name) handleNext();
      if (step === 2 && location) handleNext();
    }
  };

  // Determine styles based on current selection for preview
  const bgUrl = selectedWallpaper.url;
  const isDark = selectedTheme.isDark;

  return (
    <div className={`
      fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-700
      ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}
    `}>
      {/* Dynamic Background Preview */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-black/40' : 'bg-white/30'}`} />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-center min-h-[60vh]">
        
        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="mb-8 p-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <Sparkles size={64} className="text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
              Maxitask
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-xl font-medium leading-relaxed drop-shadow-md mb-12">
              Organize your life with clarity, beauty, and intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                onClick={handleNext}
                className="group relative px-10 py-4 rounded-full bg-white text-black text-lg font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] min-w-[200px]"
                >
                Get Started
                <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                </button>

                <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group relative px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold shadow-xl transition-all hover:bg-white/20 hover:scale-105 min-w-[200px] flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Connecting...</span>
                    ) : (
                        <>
                            <LogIn size={20} />
                            <span>Sign In</span>
                        </>
                    )}
                </button>
            </div>
            
            <button 
                onClick={handleSkipAll}
                className="mt-8 text-white/50 hover:text-white text-sm font-semibold underline decoration-white/30 hover:decoration-white transition-colors flex items-center gap-1"
            >
                Skip Setup <FastForward size={12} />
            </button>
          </div>
        )}

        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="w-full max-w-xl flex flex-col animate-in slide-in-from-right-10 fade-in duration-500">
            <label className="text-white/80 text-lg font-bold uppercase tracking-wider mb-4 ml-2">Introduction</label>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-md">What should we call you?</h2>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <User className="text-white/50" size={32} />
              </div>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your Name"
                className="w-full pl-20 pr-6 py-6 rounded-[2rem] bg-white/10 backdrop-blur-2xl border-2 border-white/20 text-3xl md:text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all shadow-2xl"
              />
              <button 
                onClick={handleNext}
                disabled={!name}
                className={`
                  absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white text-black transition-all duration-300
                  ${name ? 'opacity-100 scale-100 shadow-lg' : 'opacity-0 scale-50 pointer-events-none'}
                `}
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="w-full max-w-xl flex flex-col animate-in slide-in-from-right-10 fade-in duration-500">
             <div className="mb-4 ml-2 flex items-center gap-2">
                <span className="text-white/60 text-lg">Nice to meet you, <span className="text-white font-bold">{name}</span>.</span>
             </div>
            <label className="text-white/80 text-lg font-bold uppercase tracking-wider mb-4 ml-2">Context</label>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-md">Where are you located?</h2>
            <p className="text-white/60 mb-6 text-lg ml-1">We use this for local weather and sunrise calculations.</p>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MapPin className="text-white/50" size={32} />
              </div>
              <input
                autoFocus
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City, Country"
                className="w-full pl-20 pr-6 py-6 rounded-[2rem] bg-white/10 backdrop-blur-2xl border-2 border-white/20 text-3xl md:text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all shadow-2xl"
              />
               <button 
                onClick={handleNext}
                disabled={!location}
                className={`
                  absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white text-black transition-all duration-300
                  ${location ? 'opacity-100 scale-100 shadow-lg' : 'opacity-0 scale-50 pointer-events-none'}
                `}
              >
                <ArrowRight size={24} />
              </button>
            </div>
             <button onClick={handleNext} className="mt-6 text-white/50 hover:text-white text-sm font-semibold self-start ml-2 underline decoration-white/30 hover:decoration-white">
                Skip for now
            </button>
          </div>
        )}

        {/* STEP 3: STYLE PICKER */}
        {step === 3 && (
          <div className="w-full flex flex-col h-[85vh] animate-in slide-in-from-right-10 fade-in duration-500">
            <div className="flex-shrink-0 mb-6 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">Pick your Vibe</h2>
              <p className="text-lg text-white/80">Select a look to get started. You can change this anytime.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2 pb-24">
              
              {/* Themes Section */}
              <section>
                 <h3 className="text-white font-bold uppercase tracking-wider mb-4 ml-2 opacity-80">Theme</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {VISUAL_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`
                          relative p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col gap-2
                          ${selectedTheme.id === theme.id 
                            ? 'bg-white text-black scale-105 shadow-xl border-white' 
                            : 'bg-white/10 text-white border-white/10 hover:bg-white/20 hover:scale-105'}
                        `}
                      >
                         <div className={`w-full h-12 rounded-lg ${theme.glassColor} border ${theme.borderColor} shadow-sm`} />
                         <span className="font-bold text-sm">{theme.label}</span>
                         {selectedTheme.id === theme.id && <div className="absolute top-2 right-2 text-blue-500"><Check size={16} strokeWidth={4} /></div>}
                      </button>
                    ))}
                 </div>
              </section>

              {/* Wallpapers Section */}
              <section>
                 <h3 className="text-white font-bold uppercase tracking-wider mb-4 ml-2 opacity-80">Wallpaper</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {WALLPAPERS.map(wp => (
                      <button
                        key={wp.id}
                        onClick={() => setSelectedWallpaper(wp)}
                        className={`
                          group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-lg
                          ${selectedWallpaper.id === wp.id ? 'border-white scale-105 ring-4 ring-white/30' : 'border-transparent hover:scale-105'}
                        `}
                      >
                        <img src={wp.url} className="w-full h-full object-cover" alt={wp.label} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        {selectedWallpaper.id === wp.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                             <Check size={32} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 text-xs font-bold text-white shadow-black drop-shadow-md">{wp.label}</span>
                      </button>
                    ))}
                 </div>
              </section>

            </div>

            {/* Floating Finish Button */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
              <button 
                onClick={handleNext}
                className="px-12 py-4 rounded-full bg-white text-black text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-3"
              >
                Let's Go
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
        
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 flex gap-3 z-10">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`
              h-1.5 rounded-full transition-all duration-500
              ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/30'}
            `} 
          />
        ))}
      </div>

    </div>
  );
};

export default Onboarding;
