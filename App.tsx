
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Category, Task, TimelineEvent, VisualTheme, Wallpaper, ThemeConfig, UserProfile, Note, AppMode } from './types';
import { VISUAL_THEMES, WALLPAPERS, INITIAL_TASKS, INITIAL_CATEGORIES, INITIAL_NOTES } from './constants';
import { parseTaskWithGemini, processGeneralAIRequest } from './services/geminiService';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';
import CalendarView from './components/CalendarView';
import InputBar from './components/InputBar';
import SettingsModal from './components/SettingsModal';
import Onboarding from './components/Onboarding';
import NoteGrid from './components/NoteGrid';
import NoteEditor from './components/NoteEditor';
import AIView from './components/AIView';
import { User, Settings, Plus, X, ListTodo, StickyNote, Bot, Calendar as CalendarIcon } from 'lucide-react';

// Defaults
const DEFAULT_THEME = VISUAL_THEMES.find(t => t.id === 'liquid') || VISUAL_THEMES[0];
const DEFAULT_WALLPAPER = WALLPAPERS[10]; // Crystal Horizon

export default function App() {
  // User Profile & Onboarding State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('maxitaskUserProfile');
    return saved ? JSON.parse(saved) : { name: 'Guest', location: 'Unknown', hasOnboarded: false };
  });

  // App Mode State
  const [appMode, setAppMode] = useState<AppMode>('tasks');

  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<Category>(INITIAL_CATEGORIES[0]);
  
  // Data State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(undefined);

  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAITranscript, setLastAITranscript] = useState<string | null>(null);
  
  // Custom Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  // Visual Customization State
  const [currentTheme, setCurrentTheme] = useState<VisualTheme>(() => {
     const saved = localStorage.getItem('maxitaskThemeId');
     if (saved) return VISUAL_THEMES.find(t => t.id === saved) || DEFAULT_THEME;
     return DEFAULT_THEME;
  });
  
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
      const saved = localStorage.getItem('maxitaskWallpaperId');
      if (saved) return WALLPAPERS.find(w => w.id === saved) || DEFAULT_WALLPAPER;
      return DEFAULT_WALLPAPER;
  });

  // API Key State
  const [apiKey, setApiKey] = useState<string>(() => {
      return localStorage.getItem('maxitask_apiKey') || '';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('maxitaskThemeId', currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('maxitaskWallpaperId', currentWallpaper.id);
  }, [currentWallpaper]);

  useEffect(() => {
    localStorage.setItem('maxitaskUserProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('maxitask_apiKey', key);
  };

  // Combine VisualTheme and Wallpaper into a ThemeConfig for components
  const themeConfig: ThemeConfig = useMemo(() => ({
    ...currentTheme,
    name: currentTheme.label,
    backgroundUrl: currentWallpaper.url,
  }), [currentTheme, currentWallpaper]);

  // Focus input when adding category
  useEffect(() => {
    if (isAddingCategory && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isAddingCategory]);

  // Handle Quick Add Task (Bottom Bar)
  const handleTaskSubmit = async (input: string) => {
    setIsProcessing(true);
    const parsed = await parseTaskWithGemini(input, activeCategory, categories, apiKey);
    
    let taskCategory = parsed.category || activeCategory;
    if (!categories.includes(taskCategory)) {
        taskCategory = activeCategory;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: parsed.title || input,
      category: taskCategory,
      completed: false,
      time: parsed.time,
      date: parsed.date
    };

    setTasks(prev => [newTask, ...prev]);
    setIsProcessing(false);
  };

  // Handle Full AI Request (AI Tab)
  const handleAIRequest = async (input: string) => {
      setIsProcessing(true);
      setLastAITranscript(null);

      // Add delay for visual effect of 'thinking'
      await new Promise(r => setTimeout(r, 800));

      const response = await processGeneralAIRequest(input, categories, apiKey);
      
      // Process new Tasks
      if (response.newTasks && response.newTasks.length > 0) {
          const createdTasks: Task[] = response.newTasks.map((t, idx) => ({
              id: (Date.now() + idx).toString(),
              title: t.title || "New Task",
              category: (t.category && categories.includes(t.category)) ? t.category : activeCategory,
              completed: false,
              time: t.time,
              date: t.date
          }));
          setTasks(prev => [...createdTasks, ...prev]);
      }

      // Process new Note
      if (response.newNote) {
          const newNote: Note = {
              id: Date.now().toString() + "_note",
              title: response.newNote.title || "AI Note",
              content: response.newNote.content || "",
              category: (response.newNote.category && categories.includes(response.newNote.category)) ? response.newNote.category : activeCategory,
              lastModified: new Date(),
              date: response.newNote.date
          };
          setNotes(prev => [newNote, ...prev]);
      }

      setLastAITranscript(response.message);
      setIsProcessing(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Note Handlers
  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      category: activeCategory,
      lastModified: new Date()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(undefined);
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      setActiveCategory(trimmed);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } else {
      setIsAddingCategory(false);
    }
  };

  const handleKeyDownCategory = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleOnboardingComplete = (name: string, location: string, theme: VisualTheme, wallpaper: Wallpaper) => {
    setUserProfile({ name, location, hasOnboarded: true });
    setCurrentTheme(theme);
    setCurrentWallpaper(wallpaper);
  };

  // Convert tasks with time to timeline events
  const timelineEvents = useMemo(() => {
    return tasks
      .filter(t => t.time && !t.completed)
      .map(t => {
        const [hours, mins] = t.time!.split(':').map(Number);
        const endHour = (hours + 1) % 24;
        const endTime = `${endHour.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        return {
          id: t.id,
          title: t.title,
          startTime: t.time!,
          endTime: endTime,
          type: t.category === 'Work' ? 'work' : 'personal',
          meta: { duration: '1h' }
        } as TimelineEvent;
      });
  }, [tasks]);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId) || null, [notes, activeNoteId]);

  return (
    <div 
      className="relative w-screen h-screen bg-cover bg-center transition-all duration-700 ease-in-out overflow-hidden font-sans"
      style={{ backgroundImage: `url(${currentWallpaper.url})` }}
    >
      {/* CSS Keyframes for Border Beam */}
      <style>{`
         @keyframes border-spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
         }
         .animate-border-spin {
           animation: border-spin 4s linear infinite;
         }
      `}</style>

      {/* Dynamic Overlay for readability */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${themeConfig.isDark ? 'bg-black/40' : 'bg-white/20'}`} />

      {/* Onboarding Overlay */}
      {!userProfile.hasOnboarded && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {/* Main Layout Container */}
      <div className={`
        absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-opacity duration-1000
        ${!userProfile.hasOnboarded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <div className="w-full max-w-[1600px] h-full flex gap-6 lg:gap-12">
          
          {/* SIDEBAR: Desktop Navigation (Floating Icons) */}
          <div className="hidden md:flex flex-col items-center py-6 gap-8 z-50">
            
            {/* User Icon */}
            <div className="group relative">
               <div className={`
                 p-3.5 rounded-[1.5rem] border shadow-lg backdrop-blur-xl transition-transform duration-300 hover:scale-110
                 ${themeConfig.glassColor} ${themeConfig.borderColor} ${themeConfig.textColor}
               `}>
                 <User size={24} />
               </div>
               <div className={`
                  absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
               `}>
                  {userProfile.name}
               </div>
            </div>

            {/* Mode Switcher Group */}
            <div className="flex flex-col gap-6 mt-auto mb-auto">
               <button 
                  onClick={() => setAppMode('tasks')}
                  className={`
                    p-3.5 rounded-[1.5rem] transition-all duration-300 relative group
                    ${appMode === 'tasks' 
                       ? `${themeConfig.accentColor} ${['liquid', 'ghost'].includes(themeConfig.id) ? 'text-black' : 'text-white'} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-110` 
                       : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}
                  `}
               >
                  <ListTodo size={24} strokeWidth={appMode === 'tasks' ? 3 : 2} />
                  <div className={`
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
                  `}>
                    Tasks
                  </div>
               </button>

               <button 
                  onClick={() => setAppMode('notes')}
                  className={`
                    p-3.5 rounded-[1.5rem] transition-all duration-300 relative group
                    ${appMode === 'notes' 
                       ? `${themeConfig.accentColor} ${['liquid', 'ghost'].includes(themeConfig.id) ? 'text-black' : 'text-white'} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-110` 
                       : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}
                  `}
               >
                  <StickyNote size={24} strokeWidth={appMode === 'notes' ? 3 : 2} />
                   <div className={`
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
                  `}>
                    Notes
                  </div>
               </button>

               {/* CALENDAR TAB */}
               <button 
                  onClick={() => setAppMode('calendar')}
                  className={`
                    p-3.5 rounded-[1.5rem] transition-all duration-300 relative group
                    ${appMode === 'calendar' 
                       ? `${themeConfig.accentColor} ${['liquid', 'ghost'].includes(themeConfig.id) ? 'text-black' : 'text-white'} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-110` 
                       : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}
                  `}
               >
                  <CalendarIcon size={24} strokeWidth={appMode === 'calendar' ? 3 : 2} />
                   <div className={`
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
                  `}>
                    Calendar
                  </div>
               </button>

               {/* AI TAB */}
               <button 
                  onClick={() => setAppMode('ai')}
                  className={`
                    p-3.5 rounded-[1.5rem] transition-all duration-300 relative group
                    ${appMode === 'ai' 
                       ? `${themeConfig.accentColor} ${['liquid', 'ghost'].includes(themeConfig.id) ? 'text-black' : 'text-white'} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-110` 
                       : 'bg-transparent text-white/50 hover:text-white hover:bg-white/10'}
                  `}
               >
                  <Bot size={24} strokeWidth={appMode === 'ai' ? 3 : 2} />
                   <div className={`
                    absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                    ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
                  `}>
                    AI Studio
                  </div>
               </button>
            </div>

            {/* Settings Icon */}
            <button 
               onClick={() => setIsSettingsOpen(true)}
               className={`
                 p-3.5 rounded-[1.5rem] transition-all duration-300 relative group
                 bg-transparent text-white/50 hover:text-white hover:bg-white/10 hover:rotate-90
               `}
            >
               <Settings size={24} />
               <div className={`
                  absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                  ${themeConfig.glassColor} ${themeConfig.textColor} border ${themeConfig.borderColor} backdrop-blur-md
               `}>
                  Settings
               </div>
            </button>
          </div>


          {/* MIDDLE PANEL: Content */}
          <div className="flex-1 flex flex-col relative z-10 h-full min-w-0">
            
            {/* MOBILE HEADER (Visible only < md) */}
            <div className="md:hidden flex justify-between items-center mb-6">
                <div className={`p-2 rounded-full border ${themeConfig.glassColor} ${themeConfig.borderColor} text-white`}>
                    <User size={20} />
                </div>
                <div className={`flex items-center gap-2 p-1 rounded-full border ${themeConfig.glassColor} ${themeConfig.borderColor}`}>
                    <button onClick={() => setAppMode('tasks')} className={`p-2 rounded-full ${appMode === 'tasks' ? 'bg-white text-black' : 'text-white/60'}`}><ListTodo size={18}/></button>
                    <button onClick={() => setAppMode('notes')} className={`p-2 rounded-full ${appMode === 'notes' ? 'bg-white text-black' : 'text-white/60'}`}><StickyNote size={18}/></button>
                    <button onClick={() => setAppMode('calendar')} className={`p-2 rounded-full ${appMode === 'calendar' ? 'bg-white text-black' : 'text-white/60'}`}><CalendarIcon size={18}/></button>
                    <button onClick={() => setAppMode('ai')} className={`p-2 rounded-full ${appMode === 'ai' ? 'bg-white text-black' : 'text-white/60'}`}><Bot size={18}/></button>
                </div>
                <button onClick={() => setIsSettingsOpen(true)} className={`p-2 rounded-full border ${themeConfig.glassColor} ${themeConfig.borderColor} text-white`}>
                    <Settings size={20} />
                </button>
            </div>


            {/* Categories (Stacked Tabs) - HIDDEN IN AI & CALENDAR MODE */}
            {(appMode === 'tasks' || appMode === 'notes') && (
              <div className="flex items-center mb-8 px-1 md:pt-2 overflow-x-visible relative min-h-[50px]">
                {categories.map((cat, index) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`
                        relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 border whitespace-nowrap shadow-xl
                        first:ml-0 -ml-5 ease-out
                        ${isActive 
                          ? `z-30 ${themeConfig.accentColor} ${['liquid', 'ghost'].includes(themeConfig.id) ? 'text-black' : 'text-white'} border-transparent scale-105 -translate-y-0.5` 
                          : `z-0 hover:z-20 hover:-translate-y-1 hover:translate-x-3 hover:mr-4 
                             ${themeConfig.glassColor} ${themeConfig.borderColor} ${themeConfig.subTextColor} 
                             opacity-80 hover:opacity-100 hover:scale-105 backdrop-blur-md`}
                      `}
                      style={{ zIndex: isActive ? 40 : 10 + index }}
                    >
                      {cat}
                    </button>
                  );
                })}
                
                {isAddingCategory ? (
                  <div className={`
                    flex items-center px-4 py-2 rounded-full border backdrop-blur-md ml-4 shadow-lg z-50 animate-in fade-in slide-in-from-left-4
                    ${themeConfig.glassColor} ${themeConfig.borderColor}
                  `}>
                    <input
                      ref={newCategoryInputRef}
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={handleKeyDownCategory}
                      onBlur={handleAddCategory}
                      placeholder="New..."
                      className={`w-24 bg-transparent border-none outline-none text-sm font-bold ${themeConfig.textColor} placeholder:opacity-50`}
                    />
                    <button 
                      onClick={() => setIsAddingCategory(false)}
                      className={`ml-2 p-0.5 rounded-full hover:bg-black/10 ${themeConfig.subTextColor}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingCategory(true)}
                    className={`
                      ml-2 p-2.5 rounded-full border transition-all duration-300 z-0 relative
                      ${themeConfig.glassColor} ${themeConfig.borderColor} ${themeConfig.subTextColor} 
                      hover:scale-110 hover:opacity-100 backdrop-blur-md shadow-md hover:rotate-90
                    `}
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                {appMode === 'tasks' && (
                  <div key="tasks-view" className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TaskList 
                      key={activeCategory} // Force re-render animation on category switch
                      tasks={tasks} 
                      activeCategory={activeCategory} 
                      theme={themeConfig} 
                      onToggleTask={toggleTask}
                      onUpdateTask={handleTaskUpdate}
                    />
                    <div className="mt-auto pt-6 pb-2">
                      <InputBar theme={themeConfig} onSubmit={handleTaskSubmit} isProcessing={isProcessing} />
                    </div>
                  </div>
                )}

                {appMode === 'notes' && (
                  <div key="notes-view" className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NoteGrid 
                      key={activeCategory}
                      notes={notes}
                      activeCategory={activeCategory}
                      theme={themeConfig}
                      onSelectNote={(note) => setActiveNoteId(note.id)}
                      activeNoteId={activeNoteId}
                    />
                  </div>
                )}

                {/* NEW CALENDAR VIEW */}
                {appMode === 'calendar' && (
                  <div key="calendar-view" className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-6 duration-500">
                      <CalendarView 
                          theme={themeConfig}
                          tasks={tasks}
                          notes={notes}
                          onUpdateTask={handleTaskUpdate}
                          onUpdateNote={handleUpdateNote}
                      />
                  </div>
                )}

                {/* NEW AI VIEW */}
                {appMode === 'ai' && (
                  <div key="ai-view" className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
                     <AIView 
                        theme={themeConfig} 
                        onSubmit={handleAIRequest} 
                        isProcessing={isProcessing}
                        lastTranscript={lastAITranscript}
                     />
                  </div>
                )}
            </div>
            
          </div>

          {/* RIGHT PANEL: Contextual (Timeline or Notepad) - HIDDEN IN AI & CALENDAR MODE */}
          {(appMode === 'tasks' || appMode === 'notes') && (
            <div className={`
              hidden lg:flex w-[400px] xl:w-[450px] flex-col 
              rounded-[3rem] shadow-2xl border
              ${themeConfig.glassColor} ${themeConfig.borderColor} ${themeConfig.blurStrength}
              overflow-hidden p-8 transition-all duration-700 relative
            `}>
              {appMode === 'tasks' ? (
                <Timeline theme={themeConfig} events={timelineEvents} location={userProfile.location} />
              ) : (
                <NoteEditor 
                    note={activeNote} 
                    theme={themeConfig} 
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                    onCreate={handleCreateNote}
                />
              )}
            </div>
          )}

        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        currentWallpaper={currentWallpaper}
        onThemeSelect={setCurrentTheme}
        onWallpaperSelect={setCurrentWallpaper}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}
