
import React, { useState } from 'react';
import { ThemeConfig } from '../types';
import { ArrowUp, Sparkles, Mic } from 'lucide-react';

interface InputBarProps {
  theme: ThemeConfig;
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ theme, onSubmit, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`
        flex items-center gap-3 p-2.5 rounded-[2rem] border shadow-2xl transition-all duration-300
        ${theme.glassColor} ${theme.borderColor} ${theme.blurStrength}
      `}>
        <div className={`
          hidden sm:flex items-center justify-center w-10 h-10 rounded-full 
          ${theme.secondaryAccentColor} ${theme.subTextColor}
        `}>
          <Sparkles size={18} />
        </div>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isProcessing ? "AI is creating your task..." : "Add a task (e.g., 'Meeting at 2pm')"}
          disabled={isProcessing}
          className={`
            flex-1 bg-transparent border-none outline-none text-base font-medium px-2
            ${theme.textColor}
            placeholder:opacity-50
          `}
        />

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1">
          <button 
            type="button"
            className={`
              p-3 rounded-full transition-colors 
              ${theme.isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}
              ${theme.subTextColor}
            `}
          >
            <Mic size={20} />
          </button>

          <button 
            type="submit"
            disabled={!text || isProcessing}
            className={`
              p-3 rounded-full transition-all duration-300 flex items-center justify-center
              ${text 
                ? theme.accentColor + ' text-white shadow-lg scale-100' 
                : 'bg-transparent opacity-0 scale-75 w-0 p-0 overflow-hidden'}
            `}
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputBar;
