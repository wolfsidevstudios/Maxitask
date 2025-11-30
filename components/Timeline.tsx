
import React, { useState } from 'react';
import { ThemeConfig, TimelineEvent } from '../types';
import { Moon, Sun, Activity, Briefcase, MapPin, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TimelineProps {
  theme: ThemeConfig;
  events: TimelineEvent[];
  location?: string;
}

type ViewMode = 'day' | 'month';

// Keep mock data for chart structure
const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 87 },
  { name: 'Thu', score: 75 },
  { name: 'Fri', score: 90 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 80 },
];

const Timeline: React.FC<TimelineProps> = ({ theme, events, location }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use theme properties
  const cardBg = `${theme.glassColor} ${theme.borderColor}`;
  
  // Dynamic Date string
  const dateString = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Hours range to display (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className={`h-full flex flex-col ${theme.textColor}`}>
      {/* Header Row */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{viewMode === 'day' ? 'Today' : 'Calendar'}</h2>
          <p className={`text-sm ${theme.subTextColor}`}>{dateString}</p>
        </div>

        <div className="flex items-center gap-3">
             {/* View Toggle Pill */}
            <div className={`
                flex p-1 rounded-full border backdrop-blur-md
                ${theme.secondaryAccentColor} ${theme.borderColor}
            `}>
                <button
                    onClick={() => setViewMode('day')}
                    className={`
                        px-3 py-1 text-xs font-bold rounded-full transition-all
                        ${viewMode === 'day' ? 'bg-white text-black shadow-sm' : 'opacity-60 hover:opacity-100'}
                    `}
                >
                    Day
                </button>
                <button
                    onClick={() => setViewMode('month')}
                    className={`
                        px-3 py-1 text-xs font-bold rounded-full transition-all
                        ${viewMode === 'month' ? 'bg-white text-black shadow-sm' : 'opacity-60 hover:opacity-100'}
                    `}
                >
                    Month
                </button>
            </div>

            {/* Weather Widget (Only in Day view or Compact) */}
            <div className={`hidden sm:block p-2 px-3 rounded-2xl ${theme.secondaryAccentColor} backdrop-blur-md`}>
                <div className="flex items-center gap-2">
                    <Sun size={16} />
                    <span className="font-semibold">72°F</span>
                </div>
            </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative custom-scrollbar">
        
        {viewMode === 'day' ? (
            <>
                {/* Decorative Vertical Line */}
                <div className={`absolute left-[4.5rem] top-0 bottom-0 w-0.5 ${theme.isDark ? 'bg-white/10' : 'bg-slate-300/30'}`} />

                {/* Time Slots */}
                {hours.map((hour) => {
                const formattedHour = `${hour}:00`;
                const relevantEvents = events.filter(e => {
                    const startH = parseInt(e.startTime.split(':')[0]);
                    return startH === hour;
                });

                return (
                    <div key={hour} className="relative min-h-[60px] flex group">
                    {/* Time Label */}
                    <div className={`w-14 text-right pr-4 text-xs font-mono pt-1 ${theme.subTextColor}`}>
                        {formattedHour}
                    </div>

                    {/* Event Space */}
                    <div className="flex-1 pl-4 pb-4">
                        {relevantEvents.map(ev => (
                        <TimelineCard key={ev.id} event={ev} theme={theme} cardBg={cardBg} />
                        ))}
                    </div>
                    </div>
                );
                })}
                
                {events.length === 0 && (
                     <div className={`text-center mt-10 text-sm ${theme.subTextColor} italic`}>
                        No scheduled tasks for today.
                    </div>
                )}
            </>
        ) : (
            /* CALENDAR GRID VIEW */
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft size={20}/></button>
                    <span className="font-bold text-lg">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight size={20}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center mb-2 opacity-60 text-xs font-bold uppercase tracking-wider">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-2 auto-rows-fr">
                    {emptyDays.map(d => <div key={`empty-${d}`} />)}
                    {calendarDays.map(day => {
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                        return (
                            <div 
                                key={day} 
                                className={`
                                    aspect-square rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105
                                    ${isToday 
                                        ? `${theme.accentColor} text-white shadow-lg` 
                                        : `${theme.glassColor} border ${theme.borderColor} hover:bg-white/10`}
                                `}
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    newDate.setDate(day);
                                    setCurrentDate(newDate);
                                    setViewMode('day');
                                }}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for individual cards
const TimelineCard: React.FC<{ event: TimelineEvent, theme: ThemeConfig, cardBg: string }> = ({ event, theme, cardBg }) => {
  // Sleep Widget
  if (event.type === 'sleep') {
    return (
      <div className={`w-full p-4 rounded-2xl border backdrop-blur-md mb-2 shadow-lg ${theme.isDark ? 'bg-indigo-900/40 border-indigo-500/20' : 'bg-indigo-100/60 border-indigo-200'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
              <Moon size={14} />
            </div>
            <span className="font-semibold text-sm">Sleep</span>
            <span className="text-xs opacity-50">{event.meta?.duration} duration</span>
          </div>
        </div>
        
        <div className="h-24 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
               <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-1 text-xs opacity-70">
           <span>Score: {event.meta?.score}</span>
           <span>Avg: 7.8h</span>
        </div>
      </div>
    );
  }

  // Workout Widget
  if (event.type === 'workout') {
    return (
      <div className={`w-full p-4 rounded-2xl border backdrop-blur-md mb-2 shadow-lg bg-gradient-to-r ${theme.isDark ? 'from-orange-900/40 to-red-900/40 border-orange-500/20' : 'from-orange-100/80 to-red-100/80 border-orange-200'}`}>
        <div className="flex items-center gap-3">
           <div className="p-2 bg-orange-500 rounded-full text-white">
              <Activity size={16} />
           </div>
           <div>
             <h4 className="font-bold text-sm">Workout</h4>
             <p className="text-xs opacity-70">Running • {event.meta?.calories} cal</p>
           </div>
        </div>
      </div>
    );
  }

  // Standard/Work Event
  return (
    <div className={`w-full p-3 rounded-xl border backdrop-blur-md mb-2 shadow-sm ${theme.glassColor} ${theme.borderColor}`}>
      <div className="flex items-center gap-2">
        {event.type === 'work' && <Briefcase size={14} className="opacity-70" />}
        <span className="text-sm font-medium">{event.title}</span>
        <span className="text-xs opacity-50 ml-auto">{event.meta?.duration || '1h'}</span>
      </div>
    </div>
  );
};

export default Timeline;
