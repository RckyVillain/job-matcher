'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AiToolsView from './components/AiToolsView';
import TrackerView from './components/TrackerView';
import StatsView from './components/StatsView';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState('aiTools');
  const [isPro, setIsPro] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--background)' }}>Loading...</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isPro={isPro} setIsPro={setIsPro} />
      
      <main className="main-content">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {currentView === 'aiTools' && <AiToolsView isPro={isPro} />}
          {currentView === 'tracker' && <TrackerView isPro={isPro} />}
          {currentView === 'stats' && <StatsView />}
        </div>
      </main>
    </div>
  );
}
