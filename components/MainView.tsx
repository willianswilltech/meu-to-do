'use client';
import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Check, Star, Sun, LogOut, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import TaskDetailPanel from './TaskDetailPanel';
import { playCompleteSound } from '../lib/sound';
import { getSupabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function MainView({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { tasks, lists, selectedListId, addTask, toggleTask, toggleImportant, toggleMyDay, setSelectedTask, selectedTaskId, loadTasks } = useTaskStore();
  const [text, setText] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
      loadTasks();
      const supabase = getSupabase();
      if (supabase) {
          supabase.auth.getSession().then(({ data: { session } }) => {
              if (session?.user?.email) {
                  setUserEmail(session.user.email);
              }
          });
      }
  }, [loadTasks]);

  const handleLogout = async () => {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.push('/login');
  };

  const listTitle = lists.find(l => l.id === selectedListId)?.title || "Tarefas";
// ... (rest of the file seems fine, skipping to main return)
// need to use edit_file correctly to just replace the header


  const today = new Date();
  const filteredTasks = tasks.filter((t) => {
    if (selectedListId === '1') {
        const isMyDay = !!t.myDay;
        const isDueToday = t.dueDate && 
            new Date(t.dueDate).getFullYear() === today.getFullYear() && 
            new Date(t.dueDate).getMonth() === today.getMonth() && 
            new Date(t.dueDate).getDate() === today.getDate();
        
        return isMyDay || isDueToday;
    }
    return t.listId === selectedListId;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
  });
  const visibleTasks = hideCompleted ? sortedTasks.filter(t => !t.completed) : sortedTasks;

  const completedCount = sortedTasks.filter(t => t.completed).length;

  const handleToggleTask = (id: string, completed: boolean) => {
      if (!completed) {
          playCompleteSound();
      }
      toggleTask(id);
  };

  const exportToWhatsApp = () => {
      let text = `*${listTitle}*:\n\n`;
      sortedTasks.forEach(t => {
          text += `${t.completed ? '✅' : '⬜'} ${t.text}\n`;
      });
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  return (
    <>
      <main className="flex-1 bg-white dark:bg-[#2b2a29] p-4 md:p-8 overflow-y-auto w-full">
        {userEmail && <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
              <button className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" onClick={toggleSidebar}>
                  <Menu size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-[#323130] dark:text-[#f3f2f1]">{listTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline flex items-center gap-1"
            >
                <LogOut size={16} /> Sair
            </button>
            <button 
                onClick={exportToWhatsApp}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
                Exportar para WhatsApp
            </button>
            {completedCount > 0 && (
             <button 
                onClick={() => setHideCompleted(!hideCompleted)}
                className="text-sm text-[#2564cf] dark:text-[#4ca3f4] hover:underline"
             >
                {hideCompleted ? 'Mostrar concluídas' : 'Ocultar concluídas'}
             </button>
            )}
          </div>
        </div>
        <div className="relative bg-[#f3f2f1] dark:bg-[#323130] rounded-md transition-all mb-6">
          <input
            type="text"
            placeholder="+ Adicionar uma tarefa"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && text) {
                addTask(text);
                setText('');
              }
            }}
            className="w-full bg-transparent px-4 py-3.5 outline-none text-sm placeholder-[#2564cf] dark:placeholder-[#4ca3f4]"
          />
        </div>
        <div className="space-y-1">
          {visibleTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, scale: task.completed ? 0.98 : 1 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedTask(task.id)}
              className={`flex items-center gap-3 p-3.5 rounded-md shadow-sm border border-[#edebe9] dark:border-[#3e3d3c] hover:bg-[#faf9f8] dark:hover:bg-[#323130] cursor-pointer ${
                task.completed ? 'opacity-60 bg-[#fdfdfd] dark:bg-[#2b2a29]' : 'bg-white dark:bg-[#323130]'
              } ${selectedTaskId === task.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); handleToggleTask(task.id, task.completed); }}
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  task.completed ? 'bg-[#2564cf] border-[#2564cf]' : 'border-[#8a8886] hover:border-[#2564cf]'
                }`}
              >
                {task.completed && <Check size={14} color="white" />}
              </button>
              <span className={`text-sm text-[#323130] dark:text-[#f3f2f1] ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleImportant(task.id); }} className="ml-auto">
                <Star size={18} className={task.important ? 'fill-yellow-400 text-yellow-400' : 'text-[#8a8886]'} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); toggleMyDay(task.id); }} className="ml-2">
                <Sun size={18} className={task.myDay ? 'fill-yellow-600 text-yellow-600' : 'text-[#8a8886]'} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
      {selectedTaskId && (
        <div className="fixed inset-0 md:static md:w-[360px] h-full z-50">
          <TaskDetailPanel />
        </div>
      )}
    </>
  );
}
