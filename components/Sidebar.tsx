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
  const [isAddingSublistTo, setIsAddingSublistTo] = useState<string | null>(null);
  
  const handleSelectList = (id: string) => {
    setSelectedList(id);
    onClose();
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleAddList = (parentId: string | null = null) => {
    if (newListTitle.trim()) {
      addList(newListTitle, parentId);
      setNewListTitle('');
      setIsAddingList(false);
      setIsAddingSublistTo(null);
    }
  };

  const handleUpdateList = (id: string, newTitle?: string) => {
    const titleToUse = newTitle !== undefined ? newTitle : editingListTitle;
    if (titleToUse.trim()) {
      updateList(id, titleToUse);
    }
    setEditingListId(null);
  };

  const renderList = (parentId: string | null = null, level = 0) => {
    // Filter lists where parentId matches (handle undefined/null)
    const filteredLists = lists.filter((list) => (list.parentId || null) === parentId);
    
    // Sort to ensure 'Meu Dia' (1) and 'Tarefas' (2) are top
    return filteredLists.map((list) => (
        <div key={list.id} className="space-y-0.5" style={{ marginLeft: `${level * 12}px` }}>
          <div
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
            className={`w-full flex items-center justify-between group gap-3 px-3 py-2 rounded text-sm cursor-pointer transition-colors ${
              selectedListId === list.id
                ? 'bg-[#edebe9] dark:bg-[#3b3a39] text-[#2564cf] font-medium'
                : 'hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] text-[#323130] dark:text-[#f3f2f1]'
            } ${level > 0 ? 'ml-4 border-l border-[#c8c6c4] pl-3' : ''}`}
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
                <div className="flex items-center gap-3">
                  {list.id === '1' ? <Sun size={18} className="text-yellow-500" /> : list.id === '2' ? <Inbox size={18} className="text-blue-500" /> : <div className='w-4'/>}
                  {list.title}
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingSublistTo(list.id);
                    }}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  >
                    <Plus size={14} />
                  </button>
                  {list.id !== '1' && list.id !== '2' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteList(list.id);
                      }}
                      className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          {renderList(list.id, level + 1)}
          {isAddingSublistTo === list.id && (
            <div className="ml-8 mt-1 border-l-2 border-[#2564cf] pl-2">
              <input
                autoFocus
                placeholder="Nome da sublista"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onBlur={() => { setIsAddingList(false); setIsAddingSublistTo(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddList(list.id)}
                className="w-full px-2 py-1 text-sm rounded bg-white dark:bg-[#323130] outline-none border border-[#2564cf]"
              />
            </div>
          )}
        </div>
      ));
  };

  return (
    <aside className="w-[290px] bg-[#f3f2f1] dark:bg-[#201f1e] h-screen p-4 flex flex-col transition-colors border-r border-[#e1dfdd] dark:border-[#3e3d3c]">
      <button onClick={toggleDarkMode} className="p-2 ml-auto text-[#605e5d] dark:text-[#c4c3c2]">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="flex-1 space-y-0.5 mt-4">
        {renderList()}
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

