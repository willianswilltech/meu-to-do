import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabase } from '../lib/supabase';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  listId: string;
  createdAt: number;
  dueDate?: number;
  myDay?: boolean;
  note?: string;
  subtasks: Subtask[];
}

export interface List {
  id: string;
  title: string;
}

interface TaskStore {
  tasks: Task[];
  lists: List[];
  selectedListId: string;
  selectedTaskId: string | null;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  toggleImportant: (id: string) => void;
  toggleMyDay: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setSelectedList: (id: string) => void;
  setSelectedTask: (id: string | null) => void;
  addList: (title: string) => void;
  updateList: (id: string, title: string) => void;
  deleteList: (id: string) => void;
  loadTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>()((set) => ({
      tasks: [],
      lists: [
        { id: '1', title: 'Meu Dia' },
        { id: '2', title: 'Tarefas' },
      ],
      selectedListId: '1',
      selectedTaskId: null,
      loadTasks: async () => {
          const supabase = getSupabase();
          if (!supabase) return;
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
              set({ tasks: [] });
              return;
          }
          const { data: tasks, error } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', session.user.id);
          if (!error && tasks) {
              set({ tasks });
          }
      },
      addTask: async (text) => {
        const supabase = getSupabase();
        const user = supabase ? (await supabase.auth.getSession()).data.session?.user : null;
        
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false,
            important: false,
            myDay: false, // simplified for now
            listId: "1",
            createdAt: Date.now(),
            subtasks: [],
            user_id: user?.id,
        };

        if (supabase && user?.id) {
            await supabase.from('tasks').insert([newTask]);
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      toggleImportant: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, important: !t.important } : t
          ),
        })),
      toggleMyDay: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, myDay: !t.myDay } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      setSelectedList: (id) => set({ selectedListId: id, selectedTaskId: null }),
      setSelectedTask: (id) => set({ selectedTaskId: id }),
      addList: (title) =>
        set((state) => ({
          lists: [...state.lists, { id: Date.now().toString(), title }],
        })),
      updateList: (id, title) =>
        set((state) => ({
          lists: state.lists.map((l) => (l.id === id ? { ...l, title } : l)),
        })),
      deleteList: (id) =>
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
          tasks: state.tasks.filter((t) => t.listId !== id),
          selectedListId: state.selectedListId === id ? state.lists[0]?.id || '1' : state.selectedListId,
        })),
    }));
