'use client';

import React from 'react';
import styles from '../page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { signOut, useSession } from 'next-auth/react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isPro: boolean;
  setIsPro: (val: boolean) => void;
}

export default function Sidebar({ currentView, setCurrentView, isPro, setIsPro }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage();
  const { data: session } = useSession();

  const navItems = [
    { id: 'aiTools', label: t('aiTools') },
    { id: 'tracker', label: t('tracker') },
    { id: 'stats', label: t('stats') },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.jargon}>{t('jargon')}</p>
        
        {/* Mobile Language Selector */}
        <select 
          className={styles.mobileLangSelect}
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="id">🇮🇩 ID</option>
          <option value="en">🇬🇧 EN</option>
          <option value="zh">🇨🇳 ZH</option>
        </select>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`${styles.navItem} ${currentView === item.id ? styles.navItemActive : ''}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: isPro ? '#fbbf24' : 'var(--text-secondary)' }}>
                {isPro ? 'PRO ACTIVE 🌟' : 'Pro Mode'}
            </span>
            <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                <input 
                    type="checkbox" 
                    checked={isPro} 
                    onChange={(e) => setIsPro(e.target.checked)} 
                    style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{ 
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: isPro ? '#fbbf24' : 'var(--surface-hover)', 
                    borderRadius: '20px', transition: '.4s' 
                }}>
                    <span style={{
                        position: 'absolute', content: '""', height: '16px', width: '16px', 
                        left: isPro ? '22px' : '2px', bottom: '2px', backgroundColor: 'white', 
                        borderRadius: '50%', transition: '.4s'
                    }} />
                </span>
            </label>
        </div>

        <select 
          className={styles.langSelect}
          style={{ width: '100%', marginBottom: '1rem' }}
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="id">🇮🇩 Bahasa Indonesia</option>
          <option value="en">🇬🇧 English</option>
          <option value="zh">🇨🇳 Mandarin Simplified</option>
        </select>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center' }}>
            {session?.user?.email}
        </div>
        <button className={styles.buttonOutline} style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => signOut()}>
            Sign Out
        </button>
      </div>
    </aside>
  );
}
