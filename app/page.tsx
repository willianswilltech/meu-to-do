'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import MainView from '../components/MainView';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabase();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="flex w-screen h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
        <div className={`fixed inset-y-0 left-0 z-40 w-[290px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
        {isSidebarOpen && (
            <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      <MainView toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
}
