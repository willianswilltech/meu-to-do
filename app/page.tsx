'use client';
import Sidebar from '../components/Sidebar';
import MainView from '../components/MainView';

export default function Home() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <MainView />
    </div>
  );
}
