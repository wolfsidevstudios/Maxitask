
import React, { useState } from 'react';
import { X, Check, Palette, Image as ImageIcon, Sparkles, Zap, Lock, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { VisualTheme, Wallpaper } from '../types';
import { VISUAL_THEMES, WALLPAPERS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: VisualTheme;
  currentWallpaper: Wallpaper;
  onThemeSelect: (theme: VisualTheme) => void;
  onWallpaperSelect: (wallpaper: Wallpaper) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

type SettingsTab = 'appearance' | 'wallpaper' | 'intelligence';

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentWallpaper,
  onThemeSelect,
  onWallpaperSelect,
  apiKey,
  onApiKeyChange,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      {/* Click backdrop to close */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl transition-all duration-500" onClick={onClose} />
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] gap-8 transition-all duration-500 animate-in fade-in zoom-in-95">
        
        {/* TOP FLOATING NAV - Broken into detached islands */}
        <div className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 z-20">
          
          {/* 1. Title Island */}
          <div className={`
            flex items-center gap-4 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-3xl min-w-[200px]
            ${currentTheme.glassColor} ${currentTheme.borderColor}
          `}>
            <div className={`p-2 rounded-full ${currentTheme.accentColor} text-white shadow-lg`}>
              <Sparkles size={18} fill="currentColor" className="opacity-90" />
            </div>
            <div className="flex flex-col">
              <h2 className={`text-lg font-bold leading-none ${currentTheme.textColor}`}>Settings</h2>
              <p className={`text-[10px] uppercase tracking-wider opacity-60 font-semibold ${currentTheme.textColor}`}>Customize Maxitask</p>
            </div>
          </div>

          {/* 2. Navigation Tabs Island */}
          <div className={`
            flex items-center gap-1.5 p-2 rounded-full border shadow-2xl backdrop-blur-3xl overflow-x-auto
            ${currentTheme.glassColor} ${currentTheme.borderColor}
          `}>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                ${activeTab === 'appearance' 
                  ? `${currentTheme.isDark ? 'bg-white/10' : 'bg-black/5'} ${currentTheme.textColor} shadow-inner` 
                  : `hover:bg-white/5 ${currentTheme.subTextColor} hover:${currentTheme.textColor}`}
              `}
            >
              <Palette size={16} strokeWidth={2.5} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('wallpaper')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                ${activeTab === 'wallpaper' 
                  ? `${currentTheme.isDark ? 'bg-white/10' : 'bg-black/5'} ${currentTheme.textColor} shadow-inner` 
                  : `hover:bg-white/5 ${currentTheme.subTextColor} hover:${currentTheme.textColor}`}
              `}
            >
              <ImageIcon size={16} strokeWidth={2.5} />
              <span>Wallpaper</span>
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                ${activeTab === 'intelligence' 
                  ? `${currentTheme.isDark ? 'bg-white/10' : 'bg-black/5'} ${currentTheme.textColor} shadow-inner` 
                  : `hover:bg-white/5 ${currentTheme.subTextColor} hover:${currentTheme.textColor}`}
              `}
            >
              <Zap size={16} strokeWidth={2.5} />
              <span>Intelligence</span>
            </button>
          </div>

          {/* 3. Close Button Island */}
          <button 
            onClick={onClose}
            className={`
              group flex items-center gap-2 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-3xl font-bold transition-all duration-300 min-w-[120px] justify-center
              ${currentTheme.glassColor} ${currentTheme.borderColor} ${currentTheme.textColor}
              hover:scale-105
            `}
          >
            <span>Close</span>
            <div className={`p-1 rounded-full ${currentTheme.isDark ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/10'}`}>
              <X size={14} strokeWidth={3} />
            </div>
          </button>
        </div>

        {/* CONTENT AREA - Floating Items */}
        <div className="flex-1 w-full overflow-hidden relative">
          
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-2 pb-20">
            
            {/* THEMES TAB */}
            {activeTab === 'appearance' && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="mb-10 text-center px-4">
                  <h3 className={`text-4xl font-bold mb-2 ${currentTheme.textColor} drop-shadow-md`}>Visual Theme</h3>
                  <p className={`opacity-80 ${currentTheme.textColor} text-lg font-medium drop-shadow-md`}>Select the glass aesthetic that fits your mood.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                  {VISUAL_THEMES.map((theme) => {
                    const isActive = currentTheme.id === theme.id;
                    const cardTextColor = theme.isDark ? 'text-white' : 'text-slate-900';
                    const cardSubTextColor = theme.isDark ? 'text-white/60' : 'text-slate-500';

                    return (
                      <button
                        key={theme.id}
                        onClick={() => onThemeSelect(theme)}
                        className={`
                          group relative flex flex-col h-80 rounded-[2.5rem] overflow-hidden transition-all duration-500
                          ${isActive 
                            ? `ring-4 ring-white/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] scale-[1.02]` 
                            : 'hover:scale-[1.02] shadow-xl hover:shadow-2xl ring-1 ring-white/10'}
                        `}
                      >
                        {/* 1. Base Background Layer (Simulates a wallpaper/desktop) */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-br 
                          ${theme.isDark 
                            ? 'from-slate-900 via-purple-900/20 to-slate-900' 
                            : 'from-slate-100 via-blue-100 to-white'}
                        `} />

                        {/* 2. Mini UI Preview Container */}
                        <div className="relative flex-1 p-6 flex items-center justify-center">
                          
                          {/* The Glass Card Preview */}
                          <div className={`
                            w-full h-full rounded-3xl border shadow-lg flex flex-col p-5 gap-4 backdrop-blur-md transition-all
                            ${theme.glassColor} ${theme.borderColor} ${theme.blurStrength}
                          `}>
                            
                            {/* Header Line */}
                            <div className="flex items-center justify-between">
                              <div className={`h-2.5 w-1/3 rounded-full opacity-60 ${theme.textColor.replace('text-', 'bg-')}`} />
                              <div className={`h-6 w-6 rounded-full opacity-20 ${theme.textColor.replace('text-', 'bg-')}`} />
                            </div>

                            {/* Body Lines */}
                            <div className="space-y-2.5">
                              <div className={`h-2 w-3/4 rounded-full opacity-40 ${theme.textColor.replace('text-', 'bg-')}`} />
                              <div className={`h-2 w-1/2 rounded-full opacity-30 ${theme.textColor.replace('text-', 'bg-')}`} />
                            </div>

                            {/* Accent Button Preview */}
                            <div className={`mt-auto h-10 w-full rounded-xl ${theme.accentColor} opacity-90 shadow-md flex items-center justify-center`}>
                              <div className="h-1.5 w-12 bg-white/50 rounded-full" />
                            </div>
                          </div>

                        </div>

                        {/* 3. Bottom Label Area */}
                        <div className={`
                          relative px-8 py-6 flex items-center justify-between
                          ${theme.isDark ? 'bg-black/20' : 'bg-white/40'} backdrop-blur-md
                        `}>
                           <div className="text-left">
                             <h4 className={`text-xl font-bold tracking-tight ${cardTextColor}`}>{theme.label}</h4>
                             <p className={`text-xs font-bold uppercase tracking-wider ${cardSubTextColor}`}>
                                {theme.isDark ? 'Dark Mode' : 'Light Mode'}
                             </p>
                           </div>

                           {/* Selection Circle */}
                           <div className={`
                             w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                             ${isActive 
                                ? `${theme.accentColor} text-white shadow-lg scale-110` 
                                : `border-2 ${theme.isDark ? 'border-white/20' : 'border-black/10'} opacity-50 scale-90`}
                           `}>
                             {isActive && <Check size={20} strokeWidth={3} />}
                           </div>
                        </div>

                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WALLPAPER TAB */}
            {activeTab === 'wallpaper' && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <div className="mb-10 text-center px-4">
                  <h3 className={`text-4xl font-bold mb-2 ${currentTheme.textColor} drop-shadow-md`}>Wallpaper</h3>
                  <p className={`opacity-80 ${currentTheme.textColor} text-lg font-medium drop-shadow-md`}>Choose a backdrop for your workspace.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                  {WALLPAPERS.map((wp) => {
                    const isActive = currentWallpaper.id === wp.id;
                    return (
                      <button
                        key={wp.id}
                        onClick={() => onWallpaperSelect(wp)}
                        className={`
                          relative group aspect-[16/10] rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 shadow-xl
                          ${isActive 
                            ? `border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] scale-[1.03]` 
                            : 'border-transparent hover:scale-[1.02] hover:shadow-2xl'}
                        `}
                      >
                        <img src={wp.url} alt={wp.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                        
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                           <span className="text-white font-bold text-xl text-shadow-lg tracking-wide pl-2">{wp.label}</span>
                           {isActive && (
                             <div className="bg-white text-black p-2 rounded-full shadow-lg">
                               <Check size={18} strokeWidth={4} />
                             </div>
                           )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INTELLIGENCE TAB (API KEY) */}
            {activeTab === 'intelligence' && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-500 flex justify-center">
                 <div className={`
                    w-full max-w-2xl p-8 rounded-[3rem] border shadow-2xl backdrop-blur-xl
                    ${currentTheme.glassColor} ${currentTheme.borderColor} ${currentTheme.textColor}
                 `}>
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`p-4 rounded-2xl ${currentTheme.accentColor} text-white shadow-lg`}>
                          <Zap size={32} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold">AI Power Source</h3>
                          <p className={`opacity-70 ${currentTheme.subTextColor}`}>Connect Maxitask to Google's Gemini brain.</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`p-6 rounded-3xl border bg-white/5 ${currentTheme.borderColor}`}>
                           <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-80 mb-3">
                              <Lock size={14} /> Gemini API Key
                           </label>
                           
                           <div className="relative group">
                              <input 
                                 type={showKey ? "text" : "password"}
                                 value={apiKey}
                                 onChange={(e) => onApiKeyChange(e.target.value)}
                                 placeholder="AIzaSy..."
                                 className={`
                                    w-full pl-6 pr-14 py-4 rounded-2xl bg-black/20 border border-white/10 
                                    text-xl font-mono tracking-wide focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all
                                    placeholder:opacity-30
                                 `}
                              />
                              <button 
                                 onClick={() => setShowKey(!showKey)}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 opacity-50 hover:opacity-100 transition-all"
                              >
                                 {showKey ? <EyeOff size={20}/> : <Eye size={20}/>}
                              </button>
                           </div>
                           
                           <p className="mt-3 text-xs opacity-60 flex items-center gap-1.5">
                              <Lock size={10} /> Your key is stored locally on your device and never sent to our servers.
                           </p>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                  <Sparkles size={20} />
                               </div>
                               <div>
                                  <h4 className="font-bold text-sm">Need a key?</h4>
                                  <p className="text-xs opacity-70">Get a free Gemini API key from Google AI Studio.</p>
                               </div>
                            </div>
                            <a 
                               href="https://aistudio.google.com/app/apikey" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors"
                            >
                               Get Key <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                 </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
