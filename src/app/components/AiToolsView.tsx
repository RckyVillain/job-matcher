'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AiToolsView({ isPro }: { isPro: boolean }) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState('jobFit');
    const [jobLink, setJobLink] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState<string | null>(null);
    const [resultList, setResultList] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { id: 'jobFit', label: t('jobFit'), pro: false },
        { id: 'summary', label: t('jobSummary'), pro: false },
        { id: 'coverLetter', label: t('coverLetter'), pro: false },
        { id: 'coach', label: t('resumeCoach'), pro: false },
        { id: 'interview', label: 'Interview Prep 🌟', pro: true },
        { id: 'salary', label: 'Salary Script 🌟', pro: true }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResultText(null);
        setResultList([]);

        if (!jobLink && activeTab !== 'jobFit') {
            setError('Please provide a Job Link/Description.');
            return;
        }
        if ((activeTab === 'jobFit' || activeTab === 'coverLetter' || activeTab === 'coach' || activeTab === 'interview' || activeTab === 'salary') && !file) {
            setError('Please upload a PDF Resume.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('jobLink', jobLink);
            formData.append('lang', language);
            if (file) formData.append('resume', file);

            let endpoint = '/api/tailor'; // default for jobFit
            if (activeTab === 'summary') endpoint = '/api/summary';
            if (activeTab === 'coverLetter') endpoint = '/api/coverletter';
            if (activeTab === 'coach') endpoint = '/api/coach';
            if (activeTab === 'interview') endpoint = '/api/interview-prep';
            if (activeTab === 'salary') endpoint = '/api/salary-negotiation';

            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to process request');
            }

            const data = await res.json();
            if (activeTab === 'jobFit') {
                setResultList(data.bullets || []);
            } else if (activeTab === 'summary') {
                setResultText(data.summary);
            } else if (activeTab === 'coverLetter') {
                setResultText(data.coverLetter);
            } else if (['coach', 'interview', 'salary'].includes(activeTab)) {
                setResultText(data.advice);
            }
        } catch (err: any) {
            setError(err.message || t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                        style={{ opacity: (!isPro && tab.pro) ? 0.5 : 1, cursor: (!isPro && tab.pro) ? 'not-allowed' : 'pointer' }}
                        onClick={() => {
                            if (!isPro && tab.pro) {
                                alert("Please activate PRO MODE in the sidebar to use this premium feature.");
                                return;
                            }
                            setActiveTab(tab.id);
                            setResultText(null);
                            setResultList([]);
                            setError(null);
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.card}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('jobLinkPlaceholder')}</label>
                    <textarea
                        className={styles.textarea}
                        placeholder={t('jobLinkPlaceholder')}
                        value={jobLink}
                        onChange={(e) => setJobLink(e.target.value)}
                        required
                    />
                </div>

                {activeTab !== 'summary' && (
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('uploadResume')}</label>
                        <div className={styles.fileInputWrapper}>
                            <div className={styles.fileInput}>
                                {file ? file.name : 'Click or drag a PDF file to upload'}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? (
                        <><div className={styles.spinner}></div> {t('processing')}</>
                    ) : (
                        activeTab === 'jobFit' ? t('tailorResume') : 'Generate'
                    )}
                </button>
            </form>

            {(resultText || resultList.length > 0) && (
                <div className={`${styles.card} ${styles.results} animate-fade-in`}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Results</h2>
                    {resultText && <div className={styles.resultText}>{resultText}</div>}
                    {resultList.length > 0 && resultList.map((bullet, idx) => (
                        <div key={idx} className={styles.bulletPoint}>{bullet}</div>
                    ))}
                    <button 
                        className={styles.buttonOutline} 
                        style={{ marginTop: '1.5rem' }}
                        onClick={() => navigator.clipboard.writeText(resultText || resultList.join('\n\n'))}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
}
