
import React, { useState } from 'react';
import { Task, Category, ThemeConfig } from '../types';
import { Check, Clock, Bell, X } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeCategory: Category;
  theme: ThemeConfig;
  onToggleTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

type FilterType = 'all' | 'pending' | 'completed';

const TaskList: React.FC<TaskListProps> = ({ tasks, activeCategory, theme, onToggleTask, onUpdateTask }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => {
    if (t.category !== activeCategory) return false;
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleTimeChange = (task: Task, newTime: string) => {
    onUpdateTask({ ...task, time: newTime });
    setEditingTimeId(null);
  };

  const clearTime = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onUpdateTask({ ...task, time: undefined });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
      
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-2 px-1">
         <div className={`
            flex items-center p-0.5 rounded-full border backdrop-blur-md
            ${theme.glassColor} ${theme.borderColor}
         `}>
             {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
                 <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
                        ${filter === f 
                            ? `${theme.isDark ? 'bg-white text-black' : 'bg-black text-white'} shadow-sm` 
                            : `${theme.subTextColor} hover:${theme.textColor} hover:bg-white/5`}
                    `}
                 >
                    {f}
                 </button>
             ))}
         </div>
         
         <div className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${theme.textColor}`}>
            {filteredTasks.length} Tasks
         </div>
      </div>

      {/* Task Grid */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar pb-20 pt-2">
          {filteredTasks.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-40 opacity-60 ${theme.textColor}`}>
              <p className="text-lg font-medium">No {filter !== 'all' ? filter : ''} tasks in {activeCategory}</p>
              <p className="text-sm opacity-70">Type below to add a new task</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {filteredTasks.map((task) => (
                <div
                key={task.id}
                className={`
                    group relative flex items-start p-4 rounded-2xl cursor-pointer transition-all duration-300
                    border shadow-sm hover:shadow-md hover:scale-[1.01] hover:z-10
                    ${theme.glassColor} ${theme.borderColor} ${theme.blurStrength}
                    ${task.completed ? 'opacity-60' : 'opacity-100'}
                `}
                onClick={() => onToggleTask(task.id)}
                >
                    {/* Checkbox */}
                    <div className={`
                        mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300
                        ${task.completed 
                        ? `${theme.accentColor} border-transparent ${['liquid', 'ghost'].includes(theme.id) ? 'text-black' : 'text-white'} shadow-sm` 
                        : `border-current ${theme.subTextColor} group-hover:border-current`}
                    `}>
                        {task.completed && <Check size={12} strokeWidth={4} />}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <h3 className={`
                            text-sm font-semibold leading-snug transition-all break-words
                            ${task.completed ? 'line-through decoration-2 opacity-50' : ''}
                            ${theme.textColor}
                        `}>
                            {task.title}
                        </h3>
                        
                        {/* Time / Reminder Display */}
                        {(task.time || editingTimeId === task.id) ? (
                            <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                                {editingTimeId === task.id ? (
                                    <input 
                                        type="time" 
                                        defaultValue={task.time || ''}
                                        autoFocus
                                        onBlur={(e) => handleTimeChange(task, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleTimeChange(task, e.currentTarget.value);
                                            if (e.key === 'Escape') setEditingTimeId(null);
                                        }}
                                        className={`
                                            bg-white/20 border border-white/30 rounded px-1.5 py-0.5 text-xs font-bold ${theme.textColor} outline-none
                                        `}
                                    />
                                ) : (
                                    <div className={`
                                        flex items-center gap-1.5 text-[10px] font-bold tracking-wide 
                                        px-2 py-0.5 rounded-full border bg-white/5 backdrop-blur-sm
                                        ${theme.subTextColor} ${theme.borderColor}
                                        group/time hover:bg-white/20 transition-colors
                                    `}>
                                        <Clock size={10} />
                                        <span>{task.time}</span>
                                        <button 
                                            onClick={(e) => clearTime(e, task)}
                                            className="ml-1 opacity-0 group-hover/time:opacity-100 hover:text-red-400"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Hover Actions */}
                    {!task.completed && !task.time && editingTimeId !== task.id && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingTimeId(task.id);
                            }}
                            className={`
                                absolute top-3 right-3 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all
                                hover:bg-white/20 ${theme.subTextColor}
                            `}
                            title="Set Reminder"
                        >
                            <Bell size={14} />
                        </button>
                    )}
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default TaskList;
