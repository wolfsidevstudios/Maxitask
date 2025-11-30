
import React from 'react';
import { Note, ThemeConfig, Category } from '../types';
import { FileText, Clock } from 'lucide-react';

interface NoteGridProps {
  notes: Note[];
  activeCategory: Category;
  theme: ThemeConfig;
  onSelectNote: (note: Note) => void;
  activeNoteId?: string;
}

const NoteGrid: React.FC<NoteGridProps> = ({ notes, activeCategory, theme, onSelectNote, activeNoteId }) => {
  const filteredNotes = notes.filter(n => n.category === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto pr-2 -mr-4 pr-4 custom-scrollbar">
      {filteredNotes.length === 0 && (
        <div className={`flex flex-col items-center justify-center h-40 opacity-60 ${theme.textColor}`}>
          <p className="text-lg font-medium">No notes in {activeCategory}</p>
          <p className="text-sm opacity-70">Start writing to capture ideas</p>
        </div>
      )}

      {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`
              break-inside-avoid group cursor-pointer p-5 rounded-2xl border transition-all duration-300
              ${theme.glassColor} ${theme.borderColor} ${theme.blurStrength} shadow-lg
              hover:translate-y-[-4px] hover:shadow-2xl
              ${activeNoteId === note.id ? `ring-2 ${theme.isDark ? 'ring-white/40' : 'ring-black/20'}` : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <FileText size={14} className={theme.textColor} />
              <span className={`text-xs font-bold uppercase tracking-wider ${theme.textColor}`}>{note.category}</span>
            </div>
            
            <h3 className={`text-lg font-bold mb-2 leading-tight ${theme.textColor}`}>
              {note.title || "Untitled Note"}
            </h3>
            
            <p className={`text-sm opacity-70 line-clamp-4 mb-4 font-medium leading-relaxed ${theme.textColor}`}>
              {note.content || "No content..."}
            </p>

            <div className={`flex items-center gap-1.5 text-[10px] font-bold opacity-40 ${theme.textColor}`}>
               <Clock size={10} />
               <span>{new Date(note.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteGrid;
