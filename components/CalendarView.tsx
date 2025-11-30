
import React, { useState, useMemo } from 'react';
import { ThemeConfig, Task, Note } from '../types';
import { ChevronLeft, ChevronRight, Plus, X, Check, Calendar as CalendarIcon, FileText, ListTodo } from 'lucide-react';

interface CalendarViewProps {
  theme: ThemeConfig;
  tasks: Task[];
  notes: Note[];
  onUpdateTask: (task: Task) => void;
  onUpdateNote: (note: Note) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ theme, tasks, notes, onUpdateTask, onUpdateNote }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD

  // Helper: Get formatted date string YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Calendar Logic
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      dateObj: d,
      dateString: formatDate(d),
      dayNum: i + 1
    };
  });

  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  // Filter Items for the Month view
  const getItemsForDate = (dateString: string) => {
    const dayTasks = tasks.filter(t => t.date === dateString);
    const dayNotes = notes.filter(n => n.date === dateString);
    return { tasks: dayTasks, notes: dayNotes };
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  // Modal Handlers
  const handleAssignTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && selectedDate) {
        onUpdateTask({ ...task, date: selectedDate });
    }
  };

  const handleAssignNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && selectedDate) {
        onUpdateNote({ ...note, date: selectedDate });
    }
  };
  
  const handleRemoveDate = (type: 'task' | 'note', item: Task | Note) => {
      if (type === 'task') onUpdateTask({ ...(item as Task), date: undefined });
      else onUpdateNote({ ...(item as Note), date: undefined });
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
           <h2 className={`text-3xl font-bold ${theme.textColor}`}>
             {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
           </h2>
           <p className={`opacity-60 ${theme.textColor}`}>Plan your month ahead</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleMonthChange(-1)} className={`p-2 rounded-full hover:bg-white/10 ${theme.textColor}`}><ChevronLeft /></button>
          <button onClick={() => handleMonthChange(1)} className={`p-2 rounded-full hover:bg-white/10 ${theme.textColor}`}><ChevronRight /></button>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 px-2 text-center opacity-60 font-bold text-sm uppercase tracking-wider">
         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
             <div key={d} className={theme.textColor}>{d}</div>
         ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2 px-2 pb-4 overflow-y-auto custom-scrollbar">
         {emptyDays.map(i => <div key={`empty-${i}`} />)}
         
         {days.map(({ dateString, dayNum }) => {
             const { tasks: t, notes: n } = getItemsForDate(dateString);
             const isToday = dateString === formatDate(new Date());
             const hasItems = t.length > 0 || n.length > 0;

             return (
                 <div 
                    key={dateString}
                    onClick={() => setSelectedDate(dateString)}
                    className={`
                        relative flex flex-col p-2 rounded-2xl border transition-all duration-300 cursor-pointer min-h-[80px] group
                        ${isToday 
                            ? `${theme.accentColor} ${theme.isDark ? 'text-white' : 'text-slate-900'} border-transparent shadow-lg` 
                            : `${theme.glassColor} ${theme.borderColor} hover:bg-white/10`}
                    `}
                 >
                    <span className={`text-sm font-bold mb-1 ${isToday ? 'opacity-100' : 'opacity-50'}`}>{dayNum}</span>
                    
                    {/* Tiny Pills for preview */}
                    <div className="flex flex-wrap content-start gap-1 overflow-hidden">
                        {t.slice(0, 3).map(task => (
                            <div key={task.id} className={`w-full h-1.5 rounded-full ${theme.isDark ? 'bg-white/40' : 'bg-black/20'}`} />
                        ))}
                        {n.slice(0, 2).map(note => (
                            <div key={note.id} className={`w-full h-1.5 rounded-full ${theme.isDark ? 'bg-yellow-200/40' : 'bg-yellow-600/20'}`} />
                        ))}
                        {(t.length + n.length) > 5 && (
                             <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                        )}
                    </div>

                    {/* Hover Plus */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={14} className={isToday ? 'text-current' : theme.textColor} />
                    </div>
                 </div>
             );
         })}
      </div>

      {/* DAY DETAIL MODAL */}
      {selectedDate && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setSelectedDate(null)} />
              
              <div className={`
                 relative w-full max-w-4xl h-[80vh] rounded-[2rem] border shadow-2xl flex flex-col md:flex-row overflow-hidden
                 ${theme.glassColor} ${theme.borderColor} ${theme.blurStrength} animate-in zoom-in-95 duration-300
              `}>
                 
                 {/* LEFT: Current Date View */}
                 <div className={`flex-1 p-6 flex flex-col border-b md:border-b-0 md:border-r ${theme.borderColor}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`text-2xl font-bold ${theme.textColor}`}>
                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        <button onClick={() => setSelectedDate(null)} className={`p-2 rounded-full hover:bg-white/10 ${theme.textColor}`}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                        {/* Render Items on this Date */}
                        {[...getItemsForDate(selectedDate).tasks].map(task => (
                            <div key={task.id} className={`
                                flex items-center gap-3 p-3 px-4 rounded-full border backdrop-blur-md transition-all group
                                ${task.completed ? 'opacity-50' : 'opacity-100'}
                                bg-white/10 ${theme.borderColor} ${theme.textColor} shadow-sm
                            `}>
                                <div className={`p-1.5 rounded-full border ${theme.borderColor} ${task.completed ? theme.accentColor : 'bg-transparent'}`}>
                                    {task.completed && <Check size={10} className="text-white" />}
                                </div>
                                <span className={`flex-1 font-medium truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                                <button 
                                    onClick={() => handleRemoveDate('task', task)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {[...getItemsForDate(selectedDate).notes].map(note => (
                            <div key={note.id} className={`
                                flex items-center gap-3 p-3 px-4 rounded-full border backdrop-blur-md transition-all group
                                bg-yellow-100/10 border-yellow-200/20 ${theme.textColor} shadow-sm
                            `}>
                                <FileText size={16} className="opacity-70" />
                                <span className="flex-1 font-medium truncate">{note.title || "Untitled Note"}</span>
                                <button 
                                    onClick={() => handleRemoveDate('note', note)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {(getItemsForDate(selectedDate).tasks.length === 0 && getItemsForDate(selectedDate).notes.length === 0) && (
                            <div className="h-40 flex items-center justify-center opacity-40 italic">
                                Nothing scheduled for this day.
                            </div>
                        )}
                    </div>
                 </div>

                 {/* RIGHT: Add Items Picker */}
                 <div className="flex-1 p-6 flex flex-col bg-black/5">
                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 opacity-70 ${theme.textColor}`}>Add to this day</h4>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {/* Tasks List */}
                        <div>
                             <h5 className={`flex items-center gap-2 font-bold mb-2 ${theme.textColor}`}><ListTodo size={14}/> Tasks</h5>
                             <div className="space-y-2">
                                {tasks.filter(t => !t.date && !t.completed).map(task => (
                                    <button
                                        key={task.id}
                                        onClick={() => handleAssignTask(task.id)}
                                        className={`
                                            w-full text-left p-2.5 rounded-xl border bg-white/5 hover:bg-white/10 transition-all text-sm truncate flex justify-between group
                                            ${theme.borderColor} ${theme.textColor}
                                        `}
                                    >
                                        <span className="truncate pr-2">{task.title}</span>
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100 flex-shrink-0" />
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Notes List */}
                        <div>
                             <h5 className={`flex items-center gap-2 font-bold mb-2 mt-4 ${theme.textColor}`}><FileText size={14}/> Notes</h5>
                             <div className="space-y-2">
                                {notes.filter(n => !n.date).map(note => (
                                    <button
                                        key={note.id}
                                        onClick={() => handleAssignNote(note.id)}
                                        className={`
                                            w-full text-left p-2.5 rounded-xl border bg-white/5 hover:bg-white/10 transition-all text-sm truncate flex justify-between group
                                            ${theme.borderColor} ${theme.textColor}
                                        `}
                                    >
                                        <span className="truncate pr-2">{note.title || "Untitled"}</span>
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100 flex-shrink-0" />
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                 </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CalendarView;
