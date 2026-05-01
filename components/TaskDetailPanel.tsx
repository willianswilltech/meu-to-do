import { useTaskStore } from '../store/useTaskStore';
import { X, Star, Calendar, Trash2 } from 'lucide-react';

export default function TaskDetailPanel() {
  const { tasks, selectedTaskId, setSelectedTask, toggleImportant, updateTask, deleteTask } = useTaskStore();
  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!task) return null;

  return (
    <aside className="w-full md:w-[360px] h-full bg-[#faf9f8] dark:bg-[#201f1e] border-l border-[#edebe9] dark:border-[#3e3d3c] flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-black/5 rounded">
          <X size={20} />
        </button>
        <h2 className="flex-1 font-semibold">{task.text}</h2>
        <button onClick={() => toggleImportant(task.id)}>
          <Star size={20} className={task.important ? 'fill-yellow-400 text-yellow-400' : ''} />
        </button>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1 block">Data de conclusão</label>
        <input
          type="date"
          value={task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-CA') : ''}
          onChange={(e) => {
            const [year, month, day] = e.target.value.split('-').map(Number);
            updateTask(task.id, { dueDate: new Date(year, month - 1, day).getTime() });
          }}
          className="w-full p-2 bg-white dark:bg-[#323130] border border-[#edebe9] dark:border-[#3e3d3c] rounded text-sm outline-none"
        />
      </div>

      <textarea
        placeholder="Adicionar anotação"
        value={task.note || ''}
        onChange={(e) => updateTask(task.id, { note: e.target.value })}
        className="w-full h-32 p-4 mb-6 bg-white dark:bg-[#323130] border border-[#edebe9] dark:border-[#3e3d3c] rounded resize-none outline-none focus:border-[#2564cf]"
      />

      <div className="mt-auto pt-4 border-t border-[#edebe9] dark:border-[#3e3d3c] flex justify-between items-center text-xs text-gray-500">
        <span>Criado em {new Date(task.createdAt).toLocaleDateString()}</span>
        <button 
          onClick={() => deleteTask(task.id)}
          className="p-2 hover:bg-[#ffebeb] rounded text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </aside>
  );
}
