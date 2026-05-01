'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import MainView from '../components/MainView';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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
      <Sidebar />
      <MainView />
    </div>
  );
}
