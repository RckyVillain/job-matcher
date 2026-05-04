'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function StatsView() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        interview: 0,
        accepted: 0,
        rejected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/applications');
                const data = await res.json();
                if (data.applications) {
                    const apps = data.applications;
                    setStats({
                        total: apps.length,
                        applied: apps.filter((a: any) => a.status === 'Sudah Apply').length,
                        interview: apps.filter((a: any) => a.status === 'Menunggu Interview').length,
                        accepted: apps.filter((a: any) => a.status === 'Diterima').length,
                        rejected: apps.filter((a: any) => a.status === 'Reject').length
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('processing')}</div>;

    return (
        <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>{t('stats')}</h2>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.total}</div>
                    <div className={styles.statLabel}>Total Applications</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: 'var(--primary)' }}>{stats.applied}</div>
                    <div className={styles.statLabel}>Applied</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: 'var(--warning)' }}>{stats.interview}</div>
                    <div className={styles.statLabel}>Interviews</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: 'var(--success)' }}>{stats.accepted}</div>
                    <div className={styles.statLabel}>Accepted</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue} style={{ color: 'var(--error)' }}>{stats.rejected}</div>
                    <div className={styles.statLabel}>Rejected</div>
                </div>
            </div>
        </div>
    );
}
