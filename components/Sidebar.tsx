import { LayoutDashboard, Inbox, Plus, Moon, Sun, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { useState } from 'react';

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const { lists, setSelectedList, selectedListId, addList, deleteList, updateList } = useTaskStore();
  const [isDark, setIsDark] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  
  const handleSelectList = (id: string) => {
    setSelectedList(id);
    onClose();
  };
//... update the rest of the file to use handleSelectList instead of setSelectedList


  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleUpdateList = (id: string, newTitle?: string) => {
    const titleToUse = newTitle !== undefined ? newTitle : editingListTitle;
    if (titleToUse.trim()) {
      updateList(id, titleToUse);
    }
    setEditingListId(null);
  };

  return (
    <aside className="w-[290px] bg-[#f3f2f1] dark:bg-[#201f1e] h-screen p-4 flex flex-col transition-colors border-r border-[#e1dfdd] dark:border-[#3e3d3c]">
      <button onClick={toggleDarkMode} className="p-2 ml-auto text-[#605e5d] dark:text-[#c4c3c2]">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="flex-1 space-y-0.5 mt-4">
        {lists.map((list) => (
          <div
            key={list.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectList(list.id)}
            onDoubleClick={() => { 
                if (list.id !== '1' && list.id !== '2') {
                    setEditingListId(list.id); 
                    setEditingListTitle(list.title); 
                }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectList(list.id)}
            className={`w-full flex items-center justify-between group gap-3 px-3 py-2.5 rounded text-sm cursor-pointer ${
              selectedListId === list.id ? 'bg-white dark:bg-[#323130] shadow-sm text-[#2564cf]' : 'hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] text-[#323130] dark:text-[#f3f2f1]'
            }`}
          >
            {editingListId === list.id ? (
              <input
                autoFocus
                value={editingListTitle}
                onChange={(e) => setEditingListTitle(e.target.value)}
                onBlur={() => handleUpdateList(list.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateList(list.id);
                  if (e.key === 'Escape') setEditingListId(null);
                }}
                className="w-full px-2 py-1 text-sm rounded bg-white dark:bg-[#323130] outline-none border border-[#2564cf]"
              />
            ) : (
              <>
                <div className='flex items-center gap-3'>
                  {list.id === '1' ? <LayoutDashboard size={18} /> : <Inbox size={18} />}
                  {list.title}
                </div>
                {list.id !== '1' && list.id !== '2' && (
                  <button onClick={(e) => { e.stopPropagation(); deleteList(list.id); }} className='opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded'>
                    <Trash2 size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {isAddingList ? (
        <input 
            autoFocus
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onBlur={() => setIsAddingList(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
            className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-[#323130] outline-none border border-[#2564cf]"
        />
      ) : (
        <button 
          onClick={() => setIsAddingList(true)}
          className="flex items-center gap-2 p-3 text-sm text-[#2564cf] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded"
        >
          <Plus size={18} /> Nova lista
        </button>
      )}
    </aside>
  );
}
