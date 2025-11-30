
import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { Sparkles, ArrowUp, Bot, CheckCircle2, FileText, Loader2, Info, Calendar, List, Edit3, X } from 'lucide-react';

interface AIViewProps {
  theme: ThemeConfig;
  onSubmit: (input: string) => Promise<void>;
  isProcessing: boolean;
  lastTranscript: string | null;
}

const AIView: React.FC<AIViewProps> = ({ theme, onSubmit, isProcessing, lastTranscript }) => {
  const [input, setInput] = useState('');
  const [animationState, setAnimationState] = useState<'idle' | 'thinking' | 'creating'>('idle');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Show onboarding on first load of this component session
  useEffect(() => {
     // Check if seen in session or localstorage if we wanted persistence, 
     // but for now, let's show it if it's the first time visiting this tab
     const hasSeen = sessionStorage.getItem('hasSeenAIOnboarding');
     if (!hasSeen) {
         setShowOnboarding(true);
         sessionStorage.setItem('hasSeenAIOnboarding', 'true');
     }
  }, []);

  useEffect(() => {
    if (isProcessing) {
      setAnimationState('thinking');
      const timer = setTimeout(() => setAnimationState('creating'), 1500);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('idle');
    }
  }, [isProcessing]);

  const handleSubmit = () => {
    if (!input.trim() || isProcessing) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative animate-in fade-in duration-700">
      
      {/* Help Icon */}
      <div className="absolute top-4 right-4 z-30">
        <button 
            onClick={() => setShowOnboarding(true)}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${theme.subTextColor} hover:${theme.textColor}`}
            title="How to use AI"
        >
            <Info size={20} />
        </button>
      </div>

      {/* Transcript / Response Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 overflow-hidden">
        
        {/* State Visualizations */}
        <div className="relative min-h-[120px] flex items-center justify-center">
            {animationState === 'idle' && !lastTranscript && (
                <div className={`animate-in fade-in zoom-in duration-700 flex flex-col items-center gap-4 opacity-60 ${theme.textColor}`}>
                    <div className={`p-6 rounded-full border border-dashed ${theme.borderColor} ${theme.glassColor}`}>
                        <Sparkles size={48} strokeWidth={1} />
                    </div>
                    <p className="text-xl font-medium">Ready to create.</p>
                </div>
            )}

            {/* Thinking / Creating Animation */}
            {(animationState === 'thinking' || animationState === 'creating') && (
                <div className="flex gap-4">
                    {/* Task Creation Sim */}
                    <div className={`
                        w-32 h-40 rounded-xl border flex flex-col p-3 gap-2 bg-white/5 backdrop-blur-md shadow-2xl
                        animate-in slide-in-from-bottom-4 fade-in duration-500
                        ${theme.borderColor}
                    `}>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full mb-2" />
                        <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full border border-white/30" />
                             <div className="h-1.5 w-full bg-white/10 rounded-full animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full border border-white/30" />
                             <div className="h-1.5 w-3/4 bg-white/10 rounded-full animate-pulse delay-75" />
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                                <CheckCircle2 size={10} className="text-black" />
                            </div>
                            <span className="text-[10px] text-white/60 font-bold">Generated</span>
                        </div>
                    </div>

                    {/* Note Creation Sim */}
                    <div className={`
                        w-32 h-40 rounded-xl border flex flex-col p-3 gap-2 bg-white/5 backdrop-blur-md shadow-2xl
                        animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100
                        ${theme.borderColor}
                    `}>
                         <div className="flex items-center gap-2 mb-1 opacity-50">
                            <FileText size={12} className="text-white" />
                            <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
                         </div>
                         <div className="space-y-1.5">
                             <div className="h-1 w-full bg-white/10 rounded-full" />
                             <div className="h-1 w-full bg-white/10 rounded-full" />
                             <div className="h-1 w-5/6 bg-white/10 rounded-full" />
                             <div className="h-1 w-full bg-white/10 rounded-full animate-pulse" />
                             <div className="h-1 w-4/6 bg-white/10 rounded-full animate-pulse" />
                         </div>
                    </div>
                </div>
            )}

            {/* Result Transcript */}
            {animationState === 'idle' && lastTranscript && (
                <div className={`
                    max-w-xl p-6 rounded-2xl border backdrop-blur-xl shadow-lg
                    animate-in zoom-in-95 fade-in duration-500
                    ${theme.glassColor} ${theme.borderColor} ${theme.textColor}
                `}>
                    <div className="flex items-center justify-center gap-2 mb-2 opacity-50 uppercase tracking-widest text-xs font-bold">
                        <Bot size={14} /> AI Assistant
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed">
                        {lastTranscript}
                    </p>
                </div>
            )}
        </div>

      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 pt-4 pb-8 px-4 md:px-12 max-w-4xl mx-auto w-full relative z-20">
         <div className={`text-center mb-4 font-bold text-sm uppercase tracking-widest opacity-70 ${theme.textColor}`}>
            Start creating with AI
         </div>

         {/* The Input Box Container with Border Beam */}
         <div className="group relative rounded-[2rem] p-[1px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            <div className={`
                absolute inset-[-100%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,${theme.isDark ? '#fff' : '#000'}_50%,#0000_50%)]
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-spin
            `} />
            
            <div className={`
                relative w-full h-40 rounded-[2rem] border overflow-hidden transition-colors backdrop-blur-2xl
                ${theme.glassColor} ${theme.borderColor} ${theme.isDark ? 'group-hover:bg-black/40' : 'group-hover:bg-white/60'}
            `}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    placeholder="Describe what you need... (e.g., 'Plan a trip to Paris', 'Schedule dentist on Friday')"
                    className={`
                        w-full h-full bg-transparent border-none outline-none resize-none p-6 text-lg md:text-xl font-medium
                        placeholder:opacity-30 custom-scrollbar
                        ${theme.textColor}
                    `}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isProcessing}
                    className={`
                        absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300
                        ${input.trim() && !isProcessing
                            ? 'bg-white text-black scale-100 hover:scale-110 shadow-lg' 
                            : 'bg-white/10 text-white/20 scale-90 cursor-not-allowed'}
                    `}
                >
                    {isProcessing ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <ArrowUp size={24} strokeWidth={3} />
                    )}
                </button>
            </div>
         </div>
      </div>

      {/* ONBOARDING MODAL */}
      {showOnboarding && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
              {/* Invisible Click Overlay to Close */}
              <div className="absolute inset-0 z-0" onClick={() => setShowOnboarding(false)} />
              
              {/* Glossy Modal Content */}
              <div className={`
                  relative z-10 w-full max-w-2xl 
                  bg-black/10 backdrop-blur-3xl border border-white/20
                  rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-500
              `}>
                  <div className="absolute top-0 right-0 p-8">
                      <button onClick={() => setShowOnboarding(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="text-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500/80 to-purple-500/80 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 backdrop-blur-md">
                          <Sparkles size={32} className="text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 text-shadow-sm">Power up your productivity</h2>
                      <p className="text-white/70 text-lg font-medium">Talk naturally. Maxitask handles the rest.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <div className="p-2 w-fit rounded-full bg-blue-500/20 text-blue-300 mb-3"><List size={20}/></div>
                          <h3 className="text-white font-bold mb-1">Smart Lists</h3>
                          <p className="text-sm text-white/60 leading-relaxed font-medium">Ask for a "packing list" or "recipe", and I'll create individual tasks.</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <div className="p-2 w-fit rounded-full bg-green-500/20 text-green-300 mb-3"><Calendar size={20}/></div>
                          <h3 className="text-white font-bold mb-1">Scheduling</h3>
                          <p className="text-sm text-white/60 leading-relaxed font-medium">Say "remind me tomorrow" or "on Dec 25th" to auto-set dates.</p>
                      </div>
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
                          <div className="p-2 w-fit rounded-full bg-pink-500/20 text-pink-300 mb-3"><Edit3 size={20}/></div>
                          <h3 className="text-white font-bold mb-1">Drafting</h3>
                          <p className="text-sm text-white/60 leading-relaxed font-medium">Ask to write emails or ideas, and I'll save them as Notes.</p>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowOnboarding(false)}
                      className="mt-4 py-4 rounded-full bg-white/90 hover:bg-white text-black font-bold text-lg hover:scale-105 transition-all shadow-lg backdrop-blur-sm"
                  >
                      Got it
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default AIView;
