
import React from 'react';
import { Note, ThemeConfig } from '../types';
import { Save, Trash2, Clock } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  theme: ThemeConfig;
  onUpdate: (updatedNote: Note) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, theme, onUpdate, onDelete, onCreate }) => {
  if (!note) {
    return (
      <div className={`h-full flex flex-col items-center justify-center ${theme.textColor} opacity-60`}>
        <div className={`p-4 rounded-full mb-4 border ${theme.borderColor} ${theme.glassColor}`}>
           <FileTextIcon size={32} />
        </div>
        <p className="text-lg font-medium">Select a note to view</p>
        <button 
            onClick={onCreate}
            className={`mt-4 px-6 py-2 rounded-full font-bold bg-white/10 hover:bg-white/20 transition-colors ${theme.textColor}`}
        >
            Create New Note
        </button>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${theme.textColor}`}>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className={`text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-2`}>
            <Clock size={12} />
            Last edited {new Date(note.lastModified).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        <button 
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors opacity-60 hover:opacity-100"
        >
            <Trash2 size={18} />
        </button>
      </div>

      {/* Title Input */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdate({ ...note, title: e.target.value, lastModified: new Date() })}
        placeholder="Note Title"
        className={`
          bg-transparent border-none outline-none text-3xl font-bold mb-6 w-full
          placeholder:opacity-30 ${theme.textColor}
        `}
      />

      {/* Content Textarea */}
      <textarea
        value={note.content}
        onChange={(e) => onUpdate({ ...note, content: e.target.value, lastModified: new Date() })}
        placeholder="Start typing..."
        className={`
          flex-1 bg-transparent border-none outline-none resize-none text-lg leading-relaxed
          placeholder:opacity-30 custom-scrollbar ${theme.textColor} opacity-90
        `}
      />
    </div>
  );
};

// Helper Icon
const FileTextIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

export default NoteEditor;
