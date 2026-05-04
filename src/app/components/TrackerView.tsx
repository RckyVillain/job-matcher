'use client';

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Application {
    id: string;
    companyName: string;
    position: string;
    jobUrl: string;
    status: string;
    notes: string;
    createdAt: string;
}

export default function TrackerView({ isPro }: { isPro: boolean }) {
    const { t, language } = useLanguage();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [followUpDraft, setFollowUpDraft] = useState<string | null>(null);
    const [generatingFollowUp, setGeneratingFollowUp] = useState(false);
    
    const [formData, setFormData] = useState({
        companyName: '', position: '', jobUrl: '', status: 'Belum Apply', notes: ''
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/applications');
            const data = await res.json();
            if (data.applications) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setShowModal(false);
            setFormData({ companyName: '', position: '', jobUrl: '', status: 'Belum Apply', notes: '' });
            fetchApplications();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFollowUp = async (app: Application) => {
        if (!isPro) {
            alert("Please activate PRO MODE in the sidebar to use this feature.");
            return;
        }
        setGeneratingFollowUp(true);
        setFollowUpDraft(null);
        try {
            const res = await fetch('/api/follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: app.companyName,
                    position: app.position,
                    status: app.status,
                    notes: app.notes,
                    lang: language
                })
            });
            const data = await res.json();
            if (data.emailDraft) {
                setFollowUpDraft(data.emailDraft);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setGeneratingFollowUp(false);
        }
    };

    const getStatusClass = (status: string) => {
        return styles[`status-${status.toLowerCase().replace(/ /g, '-')}`] || '';
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch = app.companyName.toLowerCase().includes(search.toLowerCase()) || 
                              app.position.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || app.status === filter;
        return matchesSearch && matchesFilter;
    });

    const statusOptions = [
        'Belum Apply', 'Sudah Apply', 'Reject', 'No Reply', 'Diterima', 'Menunggu Interview'
    ];

    return (
        <div className="animate-fade-in">
            <div className={styles.trackerHeader}>
                <div className={styles.searchBar}>
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')} 
                        className={styles.input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                        className={styles.input} 
                        style={{ width: 'auto' }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">{t('filterAll')}</option>
                        {statusOptions.map(opt => <option key={opt} value={opt}>{t(`status${opt.replace(/ /g, '')}`)}</option>)}
                    </select>
                </div>
                <button className={styles.button} style={{ width: 'auto' }} onClick={() => setShowModal(true)}>
                    {t('addJob')}
                </button>
            </div>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>{t('processing')}</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>{t('companyName')}</th>
                                <th className={styles.th}>{t('position')}</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>{t('notes')}</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.map(app => (
                                <tr key={app.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div style={{ fontWeight: 600 }}>{app.companyName}</div>
                                        {app.jobUrl && <a href={app.jobUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Link</a>}
                                    </td>
                                    <td className={styles.td}>{app.position}</td>
                                    <td className={styles.td}>
                                        <span className={`${styles.statusBadge} ${getStatusClass(app.status)}`}>
                                            {t(`status${app.status.replace(/ /g, '')}`)}
                                        </span>
                                    </td>
                                    <td className={styles.td} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {app.notes}
                                    </td>
                                    <td className={styles.td}>
                                        <button 
                                            className={styles.buttonOutline} 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: isPro ? 1 : 0.5 }}
                                            onClick={() => handleFollowUp(app)}
                                        >
                                            {isPro ? 'Draft Follow-Up 🌟' : 'Draft Follow-Up 🔒'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={styles.td} style={{ textAlign: 'center' }}>No applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('addJob')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('companyName')}</label>
                                <input required className={styles.input} value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('position')}</label>
                                <input required className={styles.input} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('jobUrl')}</label>
                                <input className={styles.input} value={formData.jobUrl} onChange={e => setFormData({...formData, jobUrl: e.target.value})} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Status</label>
                                <select className={styles.input} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    {statusOptions.map(opt => <option key={opt} value={opt}>{t(`status${opt.replace(/ /g, '')}`)}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('notes')}</label>
                                <textarea className={styles.textarea} style={{ minHeight: '80px' }} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.buttonSecondary} onClick={() => setShowModal(false)}>{t('cancel')}</button>
                                <button type="submit" className={styles.button}>{t('save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {(followUpDraft || generatingFollowUp) && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#fbbf24' }}>AI Follow-Up Draft 🌟</h2>
                        {generatingFollowUp ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}><div className={styles.spinner} style={{ borderColor: '#fbbf24', margin: 'auto' }}></div></div>
                        ) : (
                            <>
                                <textarea className={styles.textarea} readOnly value={followUpDraft || ''} style={{ minHeight: '300px', marginBottom: '1.5rem' }} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className={styles.buttonSecondary} onClick={() => setFollowUpDraft(null)}>Close</button>
                                    <button className={styles.button} style={{ background: '#fbbf24', color: '#000' }} onClick={() => navigator.clipboard.writeText(followUpDraft || '')}>
                                        Copy to Clipboard
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
